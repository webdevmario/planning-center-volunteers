import React from 'react';

import './Button.scss';

function Button ({ name, action }) {
  return (
    <button
      type="button"
      className="button"
      onClick={() => {
        console.log('action hit');
        action();
      }}
    >
      {name}
    </button>
  );
}

export default Button;
