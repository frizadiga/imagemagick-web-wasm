import React from 'react';
import { node, func, bool, string } from 'prop-types';
import './Button.css';

const Button = (props) => {
  const { children, onClick, id, className, disabled, ...otherProps } = props;
  return (
    <button id={id} onClick={onClick} disabled={disabled} className={className} {...otherProps}>
      {props.children}
    </button>
  );
};

Button.propTypes = {
  children: node.isRequired,
  onClick: func,
  disabled: bool,
  className: string,
  id: string,
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  className: '',
  id: '',
}

export default Button;
