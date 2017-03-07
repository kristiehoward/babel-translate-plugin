### WIP

### Development

There are two ways to work with this plugin:

#### 1) Run the plugin over a simple file and view the output

The file `run.js` can be executed for any JS file. It will run the plugin and console.log out the output of the plugin.

###### Usage
Run `node run.js client/index.js` (substitute the file argument (`client/index.js`) for any `.js` file) to see the output after the plugin is run.

*Debug mode*
Run `node --inspect --debug-brk run.js client/index.js`, which will give you a URL to open in Chrome to use Chrome's debugger / DevTools to step through the code. Using the `debugger` keyword or breakpoints will stop execution just like it does in a JS app. [For more info on debug mode.](http://www.mattzeunert.com/2016/06/01/node-v8-inspector-inspect.html)

#### 2) Run the plugin as part of a Webpack / Babel setup in a sample React application with `webpack-dev-server`

You will notice that there is a `webpack.config.js` file, as well as other dependencies in the `package.json` for a local development environment. Following this [tutorial for setting up a React environment with Webpack and Babel](https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel), I have set up a local development environment with `webpack-dev-server` that will use the `webpack.config.js` file, the `HtmlWebpackPlugin`, and Babel with our `translate` plugin to bundle and compile the application code in a way that is very familiar to most React developers.

NOTE: There is currently an infinite loop (recursion) in the translate function itself with the current Webpack set up where the strings in the translate function are being wrapped by the translate function by the plugin. This infinite recursion will block the page load until it is fixed.

###### Usage
Run `yarn start` and navigate to `localhost:8080`

### Rules

#### When we apply the `translate` function

- Do NOT translate any strings passed into components as either string literals or JSXExpressionContainers with string literals
    - ex: `anotherProp={'this is a string'}` or `fixedProp="fixedProp"`
- Do NOT translate any function arguments that are string literals
    - ex: `console.log('this is a test')`
    - ex: `document.getElementById('app')`


#### Resources
[Similar plugin](https://github.com/yahoo/babel-plugin-react-intl/blob/master/src/index.js)
