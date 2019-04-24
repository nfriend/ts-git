<template>
  <div class="flex-grow-1 d-flex">
    <Sidebar
      class="flex-shrink-0 editor-sidebar"
      :filesAndFolders="filesAndFolders"
      :selectedPath="selectedPath"
      :pathBeingEdited="pathBeingEdited"
      :collapsedPaths="collapsedPaths"
      @pathSelected="pathSelected"
      @pathEditing="pathEditing"
      @pathRenamed="pathRenamed"
      @pathDeleted="pathDeleted"
      @folderToggled="folderToggled"
      @newFolder="createNewFolder"
      @newFile="createNewFile"
    />
    <MonacoEditor
      class="flex-grow-1"
      ref="editor"
      v-model="code"
      :options="options"
      theme="vs-dark"
      :language="language"
    />
  </div>
</template>

<style lang="scss" scoped>
.editor-sidebar {
  width: 200px;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import MonacoEditor from 'vue-monaco';
import * as monaco from 'monaco-editor';
import Sidebar from './Sidebar.vue';
import { Stats } from 'fs';
import * as path from 'path';
import { BrowserFSService } from '../../services/BrowserFS.service';
import { LocalStorageService } from '../../services/LocalStorage.service';
import {
  FileSystemService,
  FileSystemItem,
} from '../../services/FileSystem.service';
import debounce from 'lodash/debounce';
import without from 'lodash/without';

@Component({
  components: {
    MonacoEditor,
    Sidebar,
  },
})
export default class FileEditor extends Vue {
  /** The path that is selected in the sidebar.  Can be a folder or a file. */
  private selectedPath: string = null;

  /** The path of the item being renamed.  Can be a folder or a file. */
  private pathBeingEdited: string = null;

  /** The path of the item in the Monaco editor.  Can only point to a file. */
  private editorPath: string = null;

  /** The list of all paths that have been collapsed.  Can only point to folders. */
  private collapsedPaths: string[] = [];

  async mounted() {
    const editor = (<any>this.$refs.editor).getMonaco();
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      (<any>this).$bvToast.toast('Changes are saved automatically 😊', {
        title: 'Just a note...',
      });
    });

    this.collapsedPaths = LocalStorageService.getCollapsedFolders();

    await LocalStorageService.initializeDemoFileSystem();
    this.updateFileSystem();
  }

  options = {
    fontSize: '14px',
    automaticLayout: true,
  };

  code = '';

  @Watch('code')
  onCodeChanged(newCode: string) {
    this.debouncedSaveCode();
  }

  language: string = '';

  filesAndFolders: FileSystemItem[] = [];

  async pathSelected(path: string) {
    // cancel any pending debounced saves and save immediately
    this.debouncedSaveCode.cancel();
    await this.saveCode();

    this.selectedPath = path;
    await this.updateEditor();
  }

  async pathEditing(path: string) {
    this.pathBeingEdited = path;
    await this.updateEditor();
  }

  async pathRenamed(oldPath: string, newPath: string) {
    await FileSystemService.renameFileOrFolder(oldPath, newPath);
    this.selectedPath = newPath;
    await this.updateFileSystem();
  }

  async pathDeleted(path: string) {
    // this.editorPath = null;

    // cancel any pending debounced saves and save immediately
    this.debouncedSaveCode.cancel();
    await this.saveCode();

    // delete the path and update the file sytem
    await FileSystemService.deletePath(path);
    await this.updateFileSystem();

    // if the currently selected item was deleted,
    // clear this.selectedPath to match
    const selectedItem = FileSystemService.findItem(
      this.filesAndFolders,
      f => f.path === this.selectedPath,
    );
    if (!selectedItem) {
      this.selectedPath = null;
    }

    // if the currently selected item was being renamed,
    // clear this.selectedPath to match
    const itemBeingRenamed = FileSystemService.findItem(
      this.filesAndFolders,
      f => f.path === this.pathBeingEdited,
    );
    if (!itemBeingRenamed) {
      this.pathBeingEdited = null;
    }

    // if the editor is currently showing a path that was,
    // clear out the editor path first
    const itemInEditor = FileSystemService.findItem(
      this.filesAndFolders,
      f => f.path === this.editorPath,
    );
    if (!itemInEditor) {
      this.editorPath = null;
    }
  }

  folderToggled(path: string) {
    if (this.collapsedPaths.includes(path)) {
      this.openFolder(path);
    } else {
      this.closeFolder(path);
    }
  }

  private openFolder(path: string) {
    this.collapsedPaths = without(this.collapsedPaths, path);
    LocalStorageService.setCollapsedFolders(this.collapsedPaths);
  }

  private closeFolder(path: string) {
    this.collapsedPaths.push(path);
    LocalStorageService.setCollapsedFolders(this.collapsedPaths);
  }

  async updateFileSystem() {
    this.filesAndFolders = await FileSystemService.getDirectoryContents('/');
    this.collapsedPaths = LocalStorageService.getCollapsedFolders();
    await this.updateEditor();
  }

  async createNewFile() {
    await this.creatNewItem('file');
  }

  async createNewFolder() {
    await this.creatNewItem('folder');
  }

  private async creatNewItem(type: 'file' | 'folder') {
    // handle the case where this.selectedPath is null
    const selectedPath = this.selectedPath || '/';

    let parentFolder: string = (await FileSystemService.isDirectory(
      selectedPath,
    ))
      ? selectedPath
      : path.join(selectedPath, '../');

    this.openFolder(parentFolder);

    const newFilePath =
      type === 'folder'
        ? await FileSystemService.createNewFolder(parentFolder)
        : await FileSystemService.createNewFile(parentFolder);

    this.selectedPath = newFilePath;
    this.pathBeingEdited = newFilePath;

    await this.updateFileSystem();
    await this.updateEditor();
  }

  private extensionToLanguageMap = [
    { regex: /.js$/i, language: 'javascript' },
    { regex: /.ts$/i, language: 'typescript' },
    { regex: /.json$/i, language: 'json' },
    { regex: /.css$/i, language: 'css' },
    { regex: /.html?$/i, language: 'html' },
    { regex: /.md$/i, language: 'markdown' },
    { regex: /.yml$/i, language: 'yaml' },
    { regex: /.git\/config$/i, language: 'ini' },
  ];

  private async updateEditor() {
    try {
      if (!(await FileSystemService.isDirectory(this.selectedPath))) {
        this.editorPath = this.selectedPath;

        // update Monaco's syntax highlighting
        this.language = '';
        for (const option of this.extensionToLanguageMap) {
          if (option.regex.test(this.selectedPath)) {
            this.language = option.language;
            break;
          }
        }

        this.code = await FileSystemService.getFileContents(this.selectedPath);
      }
    } catch (err) {
      this.code = '';
    }
  }

  private async saveCode() {
    if (this.editorPath) {
      await FileSystemService.saveFile(this.editorPath, this.code);
    }
  }

  private debouncedSaveCode = debounce(this.saveCode, 1000);
}
</script>
