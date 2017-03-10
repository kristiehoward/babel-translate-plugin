 
import React from 'react';

const hi = () => 'hi';

const yostrlit = <p>'YO'</p>;
const yo = <p>YO</p>;
const foo = <p>{ hi() }</p>;

hi('there');

const one = <p>yo</p>;
const three = (
  <p>
  	yo!
  	what up?
  </p>
 );
const four = <p>{ 'yo' }</p>;
const six = <p>{ `what? ${hi()}` }</p>;
const seven = (
  <div>
    <div><i /></div>
    <p>
      { 'yo' }
      'there'
    </p>
  </div>
);

class Some extends React.Component {
	render() {
    	return (
          <div>Hi</div>
        );
    }
}

let languages = {
  'what up :user!': {
    'fr': 'salut :user!',
  }
};

const greeting = <p>{ `what up ${'t-bizzle'}` }</p>;
