import React from 'react';

interface ButtonProps {
  icon?: React.ReactNode;
  text?: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ icon, text, onClick, className }) => {
  return (
    <button className={className} onClick={onClick}>
      {icon ? <span className="button-icon">{icon}</span> : null}
      {text ? <span className="button-text">{text}</span> : null}
    </button>
  );
};

export default Button;
