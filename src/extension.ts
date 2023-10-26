import * as vscode from 'vscode';
import { pasteUploadImage } from './paste-upload-image';
import { scanUploadImage } from './scan-upload-image';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.paste-upload-image', async () => {
			try {
				await pasteUploadImage();
			} catch (err:any) {
				vscode.window.showErrorMessage('upload image fail: ' + err.message);
			}
	});

	let disposable2 = vscode.commands.registerCommand('extension.scan-upload-image', async () => {
		await scanUploadImage();
	});

	context.subscriptions.push(...[disposable, disposable2]);
}

// This method is called when your extension is deactivated
export function deactivate() {}
