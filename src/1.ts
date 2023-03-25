import * as vscode from "vscode";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "helloworld" is now active!');

  let disposable = vscode.commands.registerCommand(
    "helloworld.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello 4from HelloWorld!");
    }
  );
  const editor = vscode.window.activeTextEditor;
	console.log('sssssssssssssssssssssssssssssssssssssssssssssssss');
	
  const sourceCode = `
	function add(){
		return 1333
	}
	function add2(){
		return 1333
	}
`;
const ast = parse(sourceCode, {
});
traverse(ast, {
	FunctionDeclaration(path) {
		console.log('path', path.node);
		
	}
});
console.log('ast', ast);

  if (!editor) {
    return;
  }
//   editor.edit((editBuilder) => {
//     editBuilder.delete(
//       new vscode.Range(new vscode.Position(0, 1), new vscode.Position(2, 1))
//     );
//   });


  context.subscriptions.push(disposable);
}

export function deactivate() {}
