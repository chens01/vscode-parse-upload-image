import * as vscode from 'vscode';

export function getConfiguration(): {[key: string]: any} {
  const token = vscode.workspace.getConfiguration('pasteUploadImage')['token'];
  if (!token) {
    throw new Error("请先配置github personal access tokens");
  }

  const owner = vscode.workspace.getConfiguration('pasteUploadImage')['owner'];
  if (!owner) {
    throw new Error('请先配置github owner');
  }

  const repo = vscode.workspace.getConfiguration('pasteUploadImage')['repository'];
  if (!repo) {
    throw new Error('请先配置提交的github repository');
  }

  return {token, owner, repo};
}