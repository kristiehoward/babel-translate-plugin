const template = require('babel-template');

// includeAst is an AST representing the require call for adding our
// translation function to each source file we modify.
const includeAst = template(`var translate = require('babel-translate-plugin').translate;`)();

module.exports = function ({ types: t }) {
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

  // Idea: Only translate code INSIDE Class Declarations - nested visitors
  // TODO: use `path.get('callee') instead of path.callee`
  // https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#get-the-path-of-sub-node

  // Find the specific parent path
  // https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#find-a-specific-parent-path

  // TODO Throw babel translation errors
  // throw path.buildCodeFrameError("Error message here");

  return {
    // Require the JSX syntax
    inherits: require("babel-plugin-syntax-jsx"),
    visitor: {
      Program: {
        enter(path, state) {
          // upon entering each source file reset the state so that we don't
          // add translate requires when unnecessary
          state.changed = false;
        },
        exit(path, state) {
          if (state.changed) {
            path.unshiftContainer('body', includeAst);
          }
        },
      },

      /**
       * The JSXElement visitor transforms the contents of a JSX element if it
       * has a single child which is not another JSX element.
       *
       * This ensures that all of the content rendered by react is wrapped in a
       * translate function; nothing else will be wrapped.
       */
      JSXElement(path, state) {
        const { children } = path.node;
        if (children.length !== 1) {
          return;
        }

        const child = children[0];
        if (t.isJSXElement(child)) {
          return;
        }

        // modify the local state which is used in the Program visitor to add a
        // translate require on exit.
        state.changed = true;

        // This is already wrapped in an expression container (ie <p>{...}</p>)
        // therefore we only replace the expression container's children
        if (t.isJSXExpressionContainer(child)) {
          child.expression = wrapWithTranslateFn([child.expression]);
          return;
        }

        // From here we need to wrap everything with both an expression
        // container ({..}) for our function call _and_ the translate fn.

        // TODO: Any string values will have escaped whitespace inside them.
        // Please fix.

        switch(child.type) {
          case 'JSXText':
            // JSXText needs to be extracted and transformed into a
            // StringLiteral to be passed as an argument
            path.node.children = [t.JSXExpressionContainer(
              wrapWithTranslateFn([t.stringLiteral(child.value)])
            )];
            break;
          default:
            // By default use the JSXElement's child as the argument to
            // translate.  The translate function will be a no-op if this
            // is not a string.
            // TODO: This could potentially be smarter (numeric types etc.)
            path.node.children = [t.JSXExpressionContainer(
              wrapWithTranslateFn([child.value])
            )];
        }
      },

      ImportDeclaration(path) {
        // Skip all import declarations and their children
        path.skip();
      },
      JSXAttribute(path) {
        // Skip any JSX attributes
        path.skip();
      },
    },
  };
};
