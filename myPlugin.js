const template = require('babel-template');

// includeAst is an AST representing the require call for adding our
// translation function to each source file we modify.
const includeAst = template(`var translate = require('babel-translate-plugin').translate;`)();

module.exports = function ({ types: t }) {
  const wrapWithTranslateFn = (args) => {
    return t.callExpression(t.identifier('translate'), args);
  };

  const JSXChildrenVisitor = {
    JSXExpressionContainer: {
      exit(path, state) {
        state.changed = true;
        path.node.expression = wrapWithTranslateFn([path.node.expression]);
      },
    },

    JSXText(path, state) {
      const { value } = path.node;
      if (value.trim() === "") {
        return;
      }

      state.changed = true;
      // JSXText needs to be extracted and transformed into a
      // StringLiteral to be passed as an argument
      path.replaceWith(t.JSXExpressionContainer(
        wrapWithTranslateFn([t.stringLiteral(value)])
      ));
      path.skip();
    },
  }

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
       * has a  child which is not another JSX element.
       *
       * This ensures that all of the content rendered by react is wrapped in a
       * translate function; nothing else will be wrapped.
       */
      JSXElement(path, state) {
        const { children } = path.node;
        if (children.length === 0) {
          return;
        }

        path.traverse(JSXChildrenVisitor, state);
        path.skip();
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
