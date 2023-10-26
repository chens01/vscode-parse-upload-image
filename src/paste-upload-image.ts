import { getPathFromClipboard } from './services/clipboard-service';
import GitService from './services/git-service';
import { getConfiguration } from './services/config-service';
import * as vscode from 'vscode';
import * as fs from 'fs';


export async function pasteUploadImage() {
  const { token, owner, repo } = getConfiguration();
  
  GitService.init( token, owner, repo);

  const editor:any = vscode.window.activeTextEditor;
  // 当前编辑的文件
  let fileUri = editor.document.uri;

  // 文件不存在
  if (!fileUri) { return; }
    
  // 不是文件
  if (fileUri.scheme === 'untitled')  {
    vscode.window.showInformationMessage('请先保存文件');
    return;
  }
  
  console.log('fileUri', fileUri);

  const { imgPath,isTemp } = await getPathFromClipboard();
  const filePath = fileUri.fsPath;
  const fileName = `${filePath.substr(filePath.lastIndexOf('/') + 1).replace('.md', '')}-${+new Date()}.png`;
  const imgUrl = await GitService.uploadImage(fileName, imgPath);	
  const renderFilePath = `![](${imgUrl})`;

  if (isTemp) {
    fs.rmSync(imgPath);
  };

  editor.edit((edit:any) => {
    let current = editor.selection;

    if (current.isEmpty) {
        edit.insert(current.start, renderFilePath);
    } else {
        edit.replace(current, renderFilePath);
    }
  });
}