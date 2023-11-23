import { getPathFromClipboard } from './services/clipboard-service';
import GitService from './services/git-service';
import { getConfiguration } from './services/config-service';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function scanUploadImage() {
  const { token, owner, repo } = getConfiguration();
  
  GitService.init( token, owner, repo);

  const editor: any = vscode.window.activeTextEditor;
  if (editor.document.languageId !== 'markdown') {
     vscode.window.showInformationMessage('仅支持markdown文件');
    return;
  }

  // 当前编辑的文件
  let fileUri = editor.document.uri;
console.log('editor.document =====> ', editor);
  // 文件不存在
  if (!fileUri) { return; }
    
  // 不是文件
  if (fileUri.scheme === 'untitled')  {
    vscode.window.showInformationMessage('请先保存文件');
    return;
  }

  const text = editor.document.getText();

  const tags = [...text.matchAll(/\!\[.*\]\((.*)\)/g)];
  if (!tags.length) {
    return;
  }
  const filePath = fileUri.fsPath;
  const fileDir = filePath.substr(0, filePath.lastIndexOf('/'));
  const renderFilePaths: any = {};
  vscode.window.showInformationMessage('开始扫描图片');
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Window,
    title: '扫描中...',
    cancellable: false
  }, (progress, token) => {
    return new Promise(async resolve => {
      const total = tags.length;
      for (let i = 0; i < total; i++) {
        const tag = tags[i];
        // 忽略远程链接
        if (/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(tag[1])) {
          continue;
        }
        const imgFullPath = path.join(fileDir, tag[1]);
        console.log('imgFullPath ====> ', imgFullPath);
        const fileName = `${filePath.substr(filePath.lastIndexOf('/') + 1).replace('.md', '')}-${+new Date()}.png`;
        const imgUrl = await GitService.uploadImage(fileName, imgFullPath);
        const renderFilePath = `![](${imgUrl})`;
        console.log('renderFilePath', renderFilePath);
        renderFilePaths[tag[0]] = renderFilePath;
      }

      editor.edit((edit: any) => {
        Object.keys(renderFilePaths).forEach((tag: string) => {
          const renderFilePath = renderFilePaths[tag];
          const start = text.indexOf(tag);
          let fullRange = new vscode.Range(
            editor.document.positionAt(start),
            editor.document.positionAt(start + tag.length)
          );
          edit.replace(fullRange, renderFilePath);
        });
      });
       vscode.window.showInformationMessage('图片上传完成');
      resolve('done');
    });
  });
}