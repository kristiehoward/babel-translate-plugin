module.exports = function ({ types: t }) {
  const isWhitespaceBetweenJSXElements = (node) => {
    // TODO Find a better way to check the types for this - look at Babel Types
    return node.value === '\n       ';
  };

  // TODO ignore whitespace between:
  // - ADJ JSX elements
  // - ADJ JSXExpressions


  return {
    visitor: {
      StringLiteral(path) {
        // Things we should ignore: import statements
        console.log('-----------Open String-----------');
        console.log(path.node);
        console.log('-----------Close String-----------');
      },
      JSXText(path) {
        console.log('-----------Open JSX Text-----------');
        // console.log(path.node);
        // console.log('My cntainer are:');
        // console.log(path.getSibling(path.key - 1));
        // console.log(path.getSibling(path.key + 1));
        console.log('-----------Close JSX Text-----------');
        if (!isWhitespaceBetweenJSXElements(path.node)) {
          path.replaceWith(
            // Call the function 'translate' with arguments of [path.node.value]
            // TODO Add quotes around JSXText in translate so that it becomes
            // translate('Hello World') not translate(Hello World)
            // TODO Add language as second arg
            t.callExpression(
              t.identifier('translate'),
              [t.identifier(path.node.value)]
            )
          );
        }
      }
    },
  };
};
