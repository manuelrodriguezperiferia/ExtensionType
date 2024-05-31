
import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "chatdevopsts" is now active!');

	let StartChat = vscode.commands.registerCommand('chatdevops.StartChat', ()  => {
		vscode.commands.executeCommand("workbench.action.chat.open");
		vscode.window.showInformationMessage('wellcome to Devopschat!');
	});

	let disposable = vscode.commands.registerCommand('chatdevopsts.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from ChatdevopsTS!');
	});

	context.subscriptions.push(StartChat);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
