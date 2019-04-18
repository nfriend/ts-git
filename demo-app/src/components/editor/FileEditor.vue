<template>
  <div class="flex-grow-1 d-flex">
    <Sidebar
      class="flex-shrink-0 editor-sidebar"
      :filesAndFolders="filesAndFolders"
      @itemSelected="itemSelected"
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

export interface FileSystemItem {
  name: string;
  path: string;
  isFolder: boolean;
  isFolderOpen: boolean;
  children: FileSystemItem[];
}

@Component({
  components: {
    MonacoEditor,
    Sidebar,
  },
})
export default class FileEditor extends Vue {
  private selectedPath!: string;

  mounted() {
    this.updateFileSystem();
  }

  code = [
    "// This editor isn't functional yet!",
    '// Until it is, check out the source at',
    '// https://gitlab.com/nfriend/ts-git',
    '',
    "console.log('Hello, world!');",
  ].join('\n');

  options = {
    fontSize: '14px',
    automaticLayout: true,
  };

  language: string = '';

  filesAndFolders: FileSystemItem[] = [];

  async itemSelected(selectedPath: string) {
    this.selectedPath = selectedPath;
    await this.updateEditor();
  }

  async updateFileSystem() {
    const fs = await BrowserFSService.fsPromise;
    this.filesAndFolders = await this.getDirectoryContents('/');
    await this.updateEditor();
  }

  private async getDirectoryContents(
    directory: string,
  ): Promise<FileSystemItem[]> {
    const fs = await BrowserFSService.fsPromise;

    const filesAndFolders: FileSystemItem[] = [];
    const contents = await fs.readdirAsync(directory);

    for (const item of contents) {
      const itemPath = path.join(directory, item);
      const isDirectory = (await fs.lstatAsync(itemPath)).isDirectory();

      filesAndFolders.push({
        name: item,
        path: itemPath,
        isFolder: isDirectory,
        isFolderOpen: isDirectory,
        children: isDirectory ? await this.getDirectoryContents(itemPath) : [],
      });
    }

    return filesAndFolders;
  }

  private async getFileContents(filePath: string): Promise<string> {
    const fs = await BrowserFSService.fsPromise;

    try {
      return await fs.readFileAsync(filePath, 'utf8');
    } catch (err) {
      return '';
    }
  }

  private async updateEditor() {
    const fs = await BrowserFSService.fsPromise;
    try {
      const isDirectory = (await fs.lstatAsync(
        this.selectedPath,
      )).isDirectory();
      if (!isDirectory) {
        if (/.js$/i.test(this.selectedPath)) {
          this.language = 'javascript';
        } else if (/.css$/i.test(this.selectedPath)) {
          this.language = 'css';
        } else if (/.html?$/i.test(this.selectedPath)) {
          this.language = 'html';
        } else if (/.git\/description$/i.test(this.selectedPath)) {
          this.language = 'ini';
        } else {
          this.language = '';
        }

        this.code = await this.getFileContents(this.selectedPath);
      }
    } catch (err) {
      this.code = '';
    }
  }
}
</script>
