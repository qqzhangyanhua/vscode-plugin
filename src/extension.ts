import * as vscode from "vscode";
import { Disposable, ExtensionContext, TextEditorDecorationType, workspace } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    workspace.onDidChangeConfiguration((editor) => {
      vscode.window.showInformationMessage("插件开始执行====");

         
      })
  );
}
