<template>
  <div class="flex-grow-1 d-flex">
    <Sidebar
      class="flex-shrink-0 editor-sidebar"
      :filesAndFolders="filesAndFolders"
      :selectedItem="selectedItem"
      :itemBeingEdited="itemBeingEdited"
      @itemSelected="itemSelected"
      @itemEditing="itemEditing"
      @newFolder="createNewFolder"
      @newFile="createNewFile"
    />
    <MonacoEditor
      class="flex-grow-1"
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
import { Component, Vue } from 'vue-property-decorator';
import MonacoEditor from 'vue-monaco';
import Sidebar from './Sidebar.vue';
import { Stats } from 'fs';
import * as path from 'path';
import { BrowserFSService } from '../../services/BrowserFS.service';
import { LocalStorageService } from '../../services/LocalStorage.service';
import {
  FileSystemService,
  FileSystemItem,
} from '../../services/FileSystem.service';

@Component({
  components: {
    MonacoEditor,
    Sidebar,
  },
})
export default class FileEditor extends Vue {
  private selectedPath: string = null;
  private pathBeingEdited: string = null;

  async mounted() {
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

  async itemSelected(path: string) {
    this.selectedPath = path;
    await this.updateEditor();
  }

  async itemEditing(path: string) {
    this.pathBeingEdited = path;
    await this.updateEditor();
  }

  async updateFileSystem() {
    const fs = await BrowserFSService.fsPromise;
    this.filesAndFolders = await FileSystemService.getDirectoryContents('/');
    await this.updateEditor();
  }

  async createNewFile() {
    if (await FileSystemService.isDirectory(this.selectedPath)) {
      // find a unique filename for this file
      const siblingNames = this.selectedItem.children.map(c => c.name);
      let newFileName = 'new-file.txt';
      let counter = 0;
      while (siblingNames.includes(newFileName)) {
        newFileName = `new-file-${++counter}.txt`;
      }

      const newPath = path.join(this.selectedItem.path, newFileName);
      await LocalStorageService.createFile(newPath);

      await this.updateFileSystem();
      await this.updateEditor();

      // TODO: figure out how to find references to the new files
      // Right now the FileSystemItems are recreated with each update,
      // so can't rely on instance equality
      // this.itemBeingEdited = newFile;
      // this.selectedItem = newFile;
    } else {
      throw new Error('not yet implemented');
    }
  }

  createNewFolder() {
    console.log('new folder clicked!');
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
      if (!(await FileSystemService.isDirectory(this.selectedItem.path))) {
        // update Monaco's syntax highlighting
        this.language = '';
        for (const option of this.extensionToLanguageMap) {
          if (option.regex.test(this.selectedItem.path)) {
            this.language = option.language;
            break;
          }
        }

        this.code = await FileSystemService.getFileContents(
          this.selectedItem.path,
        );
      }
    } catch (err) {
      this.code = '';
    }
  }
}
</script>
