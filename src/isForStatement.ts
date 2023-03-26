import { parse } from "@babel/parser";
import * as vscode from "vscode";

export function checkNestedLoops(ast: any, depth = 0) {
  let loopNodes: any = [];

  if (!ast) {
    return loopNodes;
  }

  const loopTypes = [
    "ForStatement",
    "WhileStatement",
    "DoWhileStatement",
    "ForOfStatement",
    "ForInStatement",
  ];

  const arrayMethods = ["forEach", "map"];

  if (
    loopTypes.includes(ast.type) ||
    (ast.type === "CallExpression" &&
      arrayMethods.includes(ast.callee.property?.name))
  ) {
    depth += 1;
    if (depth === 3) {
      loopNodes.push(ast);
    }
  }

  for (const key in ast) {
    if (ast.hasOwnProperty(key) && typeof ast[key] === "object") {
      loopNodes.push(...checkNestedLoops(ast[key], depth));
    }
  }

  return loopNodes;
}
export function analyzeDocument(ast:any,diagnostics:any) {
  const document = vscode.window?.activeTextEditor?.document!;
  const tripleNestedLoops = checkNestedLoops(ast);
  const arr = tripleNestedLoops.map((loopNode:any) => {
    const startPosition = document.positionAt(loopNode.start);
    const endPosition = document.positionAt(loopNode.end);
    const range = new vscode.Range(startPosition, endPosition);
    const message = "是什么复杂度让你要写3层嵌套循环呢？";
    const diagnostic = new vscode.Diagnostic(
      range,
      message,
      vscode.DiagnosticSeverity.Warning
    );
    return diagnostic;
  });
  diagnostics.push(...arr);
  // diagnosticCollection.set(document.uri, diagnostics);
}




