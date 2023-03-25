const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');


// 示例代码，需要替换成你的代码字符串
const code = `
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
  
  }
}
for (let k = 0; k < 10; k++) {
    for (let l = 0; l < 10; l++) {
      console.log(i, j, k, l);
    }
  }
`;

const ast = babel.parse(code);

let maxDepth = 0; // 最大嵌套层数

traverse(ast, {
  ForStatement: {
    enter(path) {
      const parentDepth = path.findParent(
        path => path.isForStatement()
      )?.node.loopDepth || 0; // 父节点的嵌套层数
      const depth = parentDepth + 1; // 当前节点的嵌套层数
      if (depth > maxDepth) {
        maxDepth = depth;
      }
      if (maxDepth > 3) {
        console.log('AST contains more than 3 nested loops');
        path.stop(); // 停止遍历
      }
      path.node.loopDepth = depth; // 记录当前节点的嵌套层数
    },
    exit(path) {
      delete path.node.loopDepth; // 清除记录的嵌套层数
    }
  }
});

if (maxDepth <= 3) {
  console.log('AST does not contain more than 3 nested loops');
}
