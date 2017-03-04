### WIP

Run `node run.js client/index.js` to see the outputted code. At the moment, the plugin is not fully integrated with the webpack / babel set up that the rest of the React / Babel / Webpack setup would suggest.

#### Debug Mode
`node --inspect --debug-brk run.js client/index.js` will give you a URL to open in chrome to use Chrome's debugger / DevTools. Using the `debugger` keyword or general breakpoints will stop execution just like it does in a JS app.

[For more info on debug mode](http://www.mattzeunert.com/2016/06/01/node-v8-inspector-inspect.html)


### Assumptions

- Do not translate any strings passed into components as either string literals or JSXExpressionContainers with string literals
    - ex: `anotherProp={'this is a string'}` or `fixedProp="fixedProp"`
- Do not translate any function arguments that are string literals
    - ex: `console.log('this is a test')`
    - ex: `document.getElementById('app')`
