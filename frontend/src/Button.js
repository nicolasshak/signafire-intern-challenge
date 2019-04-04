import React from 'react';
import './css/button.css';

export const Button = (props) => {

  var selector = 'button';
  var message = props.message;

  if(props.value) {
    selector += ' button-active';
    message = props.activeMessage;
  }

  return(
    <div className={selector} onClick={() => {props.func(props.messageid, !props.value)}}>
      {message}
    </div>
  );
}

export default Button;