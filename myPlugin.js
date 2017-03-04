module.exports = function ({ types: t }) {
  const isWhitespaceBetweenJSXElements = (node) => {
    // TODO Find a better way to check the types for this - look at Babel Types
    // A value that has at least one non whitespace character will match this
    // regex
    return !/\S+/.test(node.value);
    // return node.value === '\n       ';
  };

  const wrapWithTranslateFn = (args) => {
    return t.callExpression(t.identifier('translate'), args);
  };

  // TODO ignore whitespace between:
  // - ADJ JSX elements
  // - ADJ JSXExpressions


  return {
    // Require the JSX syntax
    inherits: require("babel-plugin-syntax-jsx"),
    visitor: {
      ImportDeclaration(path) {
        // Skip all import declarations and their children
        path.skip();
      },
      StringLiteral(path) {
        console.log('-----------Open String-----------');
        console.log(path.node);
        console.log('-----------Close String-----------');
        // Replace this string with translate(string)
        if (path.node.value === 'app' || path.node.value === "Kristie") {
          debugger;
        }
        // TODO When we add this, we wrap it twice in the translate function
        // Look at why --> THIS IS BECAUSE WERE NOT CREATING A JSXExpressions~!!!

        // i.e. <h1>translate()</h1> vs <h1>{translate()}</h1>
        // path.replaceWith(
        //   wrapWithTranslateFn([t.identifier(path.node.value)])
        // );
      },
      JSXText(path) {
        console.log('-----------Open JSX Text-----------');
        debugger;
        // console.log(path.node);
        // console.log('My cntainer are:');
        // console.log(path.getSibling(path.key - 1));
        // console.log(path.getSibling(path.key + 1));
        const currentNodeKey = path.key;
        // Case 1: Current node is first
        // Case 2: Current node is somewhere in the middle
        // Case 3: Current node is last
        if (currentNodeKey !== 0 && currentNodeKey !== path.container.length) {
          // Check if the adjacent siblings are JSXExpressionContainers
          const aboveSibling = path.getSibling(currentNodeKey - 1);
          const belowSibling = path.getSibling(currentNodeKey + 1);
          if (t.isJSXExpressionContainer(aboveSibling)) {
            console.log('Above sibling is a JSX container');
          }
          if (t.isJSXExpressionContainer(belowSibling)) {
            console.log('Below sibling is a JSX container');
          }
        }
        console.log('-----------Close JSX Text-----------');
        if (!isWhitespaceBetweenJSXElements(path.node)) {
          path.replaceWith(
            // Call the function 'translate' with arguments of [path.node.value]
            // Do not parse the same node twice!
            // TODO Add language as second arg
            // TODO Wrap this in a JS expression 
            wrapWithTranslateFn([t.stringLiteral(path.node.value)])
          );
        }
      }
    },
  };
};
