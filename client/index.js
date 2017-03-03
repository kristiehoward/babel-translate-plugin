// TODO Automatically need to import translate function (try webpack?)
import { translate } from 'translations.js';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import App from './components/App';

class App extends Component {
  renderMailTo(someVar) {
    const mailto = [
      'mailto:dev@docker.com',
      '?Subject=Putting a complicated string here',
      '&Body=Just to make ',
      someVar,
      '.%0A%0A%0A%0A',
      'your life hard',
    ];
    return (
      <div>
        If you think this will be simple,
        {"please "}
        {`check all of the ${someVar} edge cases`}
        <a href={mailto.join('')}>fix it!</a>
      </div>
    );
  }

  sayHi() {
    return 'Hi Tony';
  }

 render() {
   const { someVar } = this.props;
   return (
     <div>
       <h1>Hello World</h1>
       <h2>It is me</h2>
       <p>{this.sayHi()}</p>
       {this.renderMailTo(someVar)}
     </div>
   );
 }
}

ReactDOM.render(<App someVar="Kristie" />, document.getElementById('app'));
