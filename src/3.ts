import * as vscode from "vscode";

// 创建一个 DiagnosticCollection 实例
const diagnosticCollection =
  vscode.languages.createDiagnosticCollection("myPlugin");

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("我的插件启动成功!!!!");



  // 注册一个命令，用于添加错误信息
  const addDiagnosticCommand = vscode.commands.registerCommand(
    "myPlugin.addDiagnostic",
    () => {
      // 获取当前活动编辑器的 URI
      const uri = vscode.window.activeTextEditor?.document.uri;
      if (uri) {
        // 创建一个新的 Diagnostic 实例
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(0, 10)
          ),
          "This is an error message.",
          vscode.DiagnosticSeverity.Error
        );

        // 将 Diagnostic 实例添加到 DiagnosticCollection 中
        diagnosticCollection.set(uri, [diagnostic]);
      }
    }
  );

  // 注册一个命令，用于移除错误信息
  const removeDiagnosticCommand = vscode.commands.registerCommand(
    "myPlugin.removeDiagnostic",
    () => {
      // 获取当前活动编辑器的 URI
      const uri = vscode.window.activeTextEditor?.document.uri;
      if (uri) {
        // 从 DiagnosticCollection 中移除特定 URI 的错误信息
        diagnosticCollection.delete(uri);
      }
    }
  );

  // 添加命令到上下文中，使它们可以被调用
  context.subscriptions.push(
    addDiagnosticCommand,
    removeDiagnosticCommand,

    vscode.workspace.onDidOpenTextDocument((document) => {
      console.log('触发=====================================');
			if (document.languageId === 'javascript') {
				// 获取文档内容
        
				const text = document.getText();
				if (text.includes('TODO:')) {
					// 在编辑器底部显示提示信息
					vscode.window.showInformationMessage('JavaScript文件包含TODO项！');
				}
			}
		})
  );
}
