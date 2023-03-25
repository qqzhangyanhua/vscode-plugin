const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;

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