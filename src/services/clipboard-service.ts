import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { spawn } from 'child_process';

function runMacScript(imgPath:string): Promise<string>{
  let scriptPath = path.resolve(__dirname, '../res/mac.applescript');
  console.log(__dirname);
  console.log('scriptPath', scriptPath);
  return new Promise((resolve, reject) => {
    let ascript = spawn('osascript', [scriptPath, imgPath]);
    ascript.on('error', function (e) {
      reject(e);
    });
    ascript.on('exit', function (code, signal) {
    });
    ascript.stdout.on('data', function (data: Buffer) {
      console.log('data', data.toString().trim());
      resolve(data.toString().trim());
    });
  });
}

function runWindowScript(imgPath:string): Promise<string>
{
  const scriptPath = path.join(__dirname, '../res/pc.ps1');

  return new Promise((resolve, reject) => {
    let command = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
    let powershellExisted = fs.existsSync(command)
    if (!powershellExisted) {
      command = "powershell"
    }

    const powershell = spawn(command, [
      '-noprofile',
      '-noninteractive',
      '-nologo',
      '-sta',
      '-executionpolicy', 'unrestricted',
      '-windowstyle', 'hidden',
      '-file',
      scriptPath,
      imgPath
    ]);
    powershell.on('error', function (e: any) {
      reject(e);
    });
    powershell.on('exit', function (code, signal) {
      console.log('exit', code, signal);
    });
    powershell.stdout.on('data', function (data: Buffer) {
      resolve(data.toString().trim());
    });
  });
}

export async function getPathFromClipboard():Promise<any> {
  const tempPath = path.resolve(__dirname, `./temp-img-${+new Date()}.png`);
  const platform = process.platform;
  let data;
  if (platform === 'win32') {
    data = await runWindowScript(tempPath);
  }
  else if (platform === 'darwin') {
    data = await runMacScript(tempPath);
  }

  if (!data) {
    throw new Error('image not found');
  }

  let isTemp = true;
  // 不是临时的截图文件
  if (tempPath !== data) {
    isTemp = false;
  }
  return { imgPath: data, isTemp };
}