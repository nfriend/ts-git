<template>
  <div class="flex-grow-1 d-flex">
    <Sidebar
      class="flex-shrink-0 editor-sidebar"
      :filesAndFolders="filesAndFolders"
      :selectedPath="selectedPath"
      :pathBeingEdited="pathBeingEdited"
      @pathSelected="pathSelected"
      @pathEditing="pathEditing"
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

  async mounted() {
    const editor = (<any>this.$refs.editor).getMonaco();
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      (<any>this).$bvToast.toast('Changes are saved automatically 😊', {
        title: 'Just a note...',
      });
    });

    await LocalStorageService.initializeDemoFileSystem();
    this.updateFileSystem();
  }

  options = {
    fontSize: '14px',
    automaticLayout: true,
  };

  code = '';

  language: string = '';

  filesAndFolders: FileSystemItem[] = [];

  async pathSelected(path: string) {
    this.debouncedSaveCode.flush();
    this.selectedPath = path;
    await this.updateEditor();
  }

  async pathEditing(path: string) {
    this.pathBeingEdited = path;
    await this.updateEditor();
  }

  async updateFileSystem() {
    const fs = await BrowserFSService.fsPromise;
    this.filesAndFolders = await FileSystemService.getDirectoryContents('/');
    await this.updateEditor();
  }

  async createNewFile() {
    await this.creatNewItem('file');
  }

  async createNewFolder() {
    await this.creatNewItem('folder');
  }

  @Watch('code')
  onChildChanged(newCode: string) {
    this.debouncedSaveCode();
  }

  private async creatNewItem(type: 'file' | 'folder') {
    let parentFolder: string = (await FileSystemService.isDirectory(
      this.selectedPath,
    ))
      ? this.selectedPath
      : path.join(this.selectedPath, '../');

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
    { regex: /.git\/description$/i, language: 'ini' },
  ];

  private async updateEditor() {
    const fs = await BrowserFSService.fsPromise;
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
    await FileSystemService.saveFile(this.editorPath, this.code);
  }

  private debouncedSaveCode = debounce(this.saveCode, 1000);
}
</script>
