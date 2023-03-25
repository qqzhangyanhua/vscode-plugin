import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "helloworld.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello 4from HelloWorld!");
    }
  );
  // 创建一个 Diagnostic 对象
  const diagnostic: vscode.Diagnostic = new vscode.Diagnostic(
    //创建一个错误信息
    new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10)),
    "这是一个错误提示",
    vscode.DiagnosticSeverity.Error
  );

  // 获取当前活动的文本编辑器
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    // 获取文本编辑器的 URI
    const uri = activeEditor.document.uri;

    // 创建一个 Diagnostic 集合
    const collection = vscode.languages.createDiagnosticCollection("my-plugin");

      // 注册一个命令，用于移除错误信息
      const removeDiagnosticCommand = vscode.commands.registerCommand('myPlugin.removeDiagnostic', () => {
        // 获取当前活动编辑器的 URI
        const uri = vscode.window.activeTextEditor?.document.uri;
        if (uri) {
            // 从 DiagnosticCollection 中移除特定 URI 的错误信息
            collection.delete(uri);
        }
    });
    // 将 Diagnostic 对象添加到集合中
    collection.set(uri, [diagnostic]);
  context.subscriptions.push(disposable);

  }
}
export function deactivate() {}
