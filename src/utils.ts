const vscode = require("vscode");
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const babelPresetTypeScript = require("@babel/preset-typescript");
export const removeConsoleLog = (code: any, isTypeScript = false) => {
  const ast = parser.parse(code, {
    sourceType: "module",
    presets: isTypeScript ? [babelPresetTypeScript] : [],
  });
  traverse(ast, {
    CallExpression(path: any) {
      if (
        path.node.callee.type === "MemberExpression" &&
        path.node.callee.object.name === "console" &&
        path.node.callee.property.name === "log"
      ) {
        path.remove();
      }
    },
  });

  return generate(ast).code;
};
//用于返回当前项目中使用的vue版本
export async function getVueVersion() {
  const packageJsonUri = vscode.workspace.workspaceFolders[0].uri.with({
    path: `${vscode.workspace.workspaceFolders[0].uri.path}/package.json`,
  });
  const packageJsonContent = (
    await vscode.workspace.fs.readFile(packageJsonUri)
  ).toString();
  const packageJson = JSON.parse(packageJsonContent);

  if (packageJson.dependencies && packageJson.dependencies.vue) {
    return packageJson.dependencies.vue;
  } else if (packageJson.devDependencies && packageJson.devDependencies.vue) {
    return packageJson.devDependencies.vue;
  } else {
    return "==============null";
  }
}
