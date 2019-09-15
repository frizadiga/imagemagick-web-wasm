import React from 'react';
import { node, func, bool } from 'prop-types';
import './Button.css';

const Button = (props) => {
  const { children, onClick, disabled, ...otherProps } = props;
  return (
    <button onClick={onClick} disabled={disabled} {...otherProps}>
      {props.children}
    </button>
  );
};

Button.propTypes = {
  children: node.isRequired,
  onClick: func,
  disabled: bool
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
}

export default Button;
