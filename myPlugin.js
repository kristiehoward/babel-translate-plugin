module.exports = function (babel) {
  const { types: t } = babel;
  const isWhitespaceBetweenJSXElements = (path) => {
    // const currentNodeKey = path.key;
    // // Case 1: Current node is first
    // // Case 2: Current node is somewhere in the middle
    // // Case 3: Current node is last
    // if (currentNodeKey !== 0 && currentNodeKey !== path.container.length) {
    //   // Check if the adjacent siblings are JSXExpressionContainers
    //   const aboveSibling = path.getSibling(currentNodeKey - 1);
    //   const belowSibling = path.getSibling(currentNodeKey + 1);
    //   if (t.isJSXExpressionContainer(aboveSibling)) {
    //     console.log('Above sibling is a JSX container');
    //   }
    //   if (t.isJSXExpressionContainer(belowSibling)) {
    //     console.log('Below sibling is a JSX container');
    //   }
    // }
    // TODO Find a better way to check the types for this - look at Babel Types
    // A value that has at least one non whitespace character will match this
    // regex
    return !/\S+/.test(path.node.value);
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
      JSXAttribute(path) {
        // Skip any JSX attributes
        path.skip();
      },
      StringLiteral(path) {
        // If the parent of the string literal is the translate function,
        // ignore it because we added the string literal in the JSX text visitor
        const parent = path.parentPath.node;
        if (t.isCallExpression(parent) && parent.callee.name === 'translate') {
          console.log('Skipping ', path.node.value);
          path.skip();
        } else if (path.listKey === 'arguments') {
          // Skip string literal arguments to functions
          console.log('Skipping for LIST KEY ', path.node.value);
          path.skip();
        } else {
          path.replaceWith(
            wrapWithTranslateFn([t.stringLiteral(path.node.value)])
          );
        }
      },
      JSXText(path) {
        if (!isWhitespaceBetweenJSXElements(path)) {
          // If the parent is a JSXElement, wrap in a JSX Expression container
          // console.log('JSXText', path.node.value);
          path.replaceWith(
            // Call the function 'translate' with arguments of [path.node.value]
            // Do not parse the same node twice!
            // TODO Add language as second arg
            t.JSXExpressionContainer(
              wrapWithTranslateFn([t.stringLiteral(path.node.value)])
            )

          );
        }
      }
    },
  };
};
