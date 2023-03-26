import * as vscode from "vscode";
import { parse } from "@babel/parser";
import babelTraverse from "@babel/traverse";
import { analyzeDocument } from "./isForStatement";
const vueCompiler = require("vue-template-compiler");
function getScriptFromVue(content: any) {
  const parsed = vueCompiler.parseComponent(content);
  return parsed.script ? parsed.script.content : "";
}
export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("formatCheckCode");
  let disposable = vscode.commands.registerCommand(
    "formatCheckCode.detectSetTimeout",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const isVueFile = editor.document.fileName.endsWith(".vue");
      const content = editor.document.getText();
      const diagnostics: any = [];
      const code = isVueFile ? getScriptFromVue(content) : content;
      const ast = parse(code, {
        sourceType: "module",
      });
      analyzeDocument( ast,diagnostics);
      babelTraverse(ast, {
        CallExpression(path: any) {
          const callee = path.node.callee;
          const functionName =
            callee.name || (callee.property && callee.property.name);
          if (functionName === "setTimeout") {
            const loc = path.node.loc;
            const startPosition = new vscode.Position(
              loc.start.line - 1,
              loc.start.column
            );
            const endPosition = new vscode.Position(
              loc.end.line - 1,
              loc.end.column
            );
            const range = new vscode.Range(startPosition, endPosition);
            const message = isVueFile
              ? "是什么想不开让你在vue里setTimeout呢?,事件循环整不清?"
              : "为什么用setTimeout呢?";
            const diagnostic = new vscode.Diagnostic(
              range,
              message,
              vscode.DiagnosticSeverity.Warning
            );
            diagnostics.push(diagnostic);
          }
        },
      });
      diagnosticCollection.set(editor.document.uri, diagnostics);
    }
  );

  const removeDiagnosticCommand = vscode.commands.registerCommand(
    "formatCheckCode.removeDiagnostic",
    () => {
      // 获取当前活动编辑器的 URI
      const uri = vscode.window.activeTextEditor?.document.uri;
      if (uri) {
        // 从 DiagnosticCollection 中移除特定 URI 的错误信息
        diagnosticCollection.delete(uri);
      }
    }
  );
  //如果要监听文本变化，可以使用下面的代码
  // context.subscriptions.push(
  //   vscode.workspace.onDidChangeTextDocument((e) => {
  //     if (e.document.languageId === 'javascript') {
  //       analyzeDocument(e.document);
  //     }
  //   })
  // );
  context.subscriptions.push(disposable);
}
