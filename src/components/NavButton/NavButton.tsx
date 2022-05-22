import React from 'react';
import PropTypes from 'prop-types';

import navButtonStyles from './NavButton.module.scss';

interface NavButtonProps {
  icon: React.ReactElement,
  selected: boolean,
  children: string
}

const NavButton = ({icon, selected, children}: NavButtonProps) => {
  return (
    <li className={`${navButtonStyles.root} pl-5 pr-5 pb-4 pt-4`}>
      <a href="/"
         className={`${navButtonStyles.link} ${selected ?
           `${navButtonStyles.root_selected} text text_type_main-default`
           : 'text text_type_main-default text_color_inactive'}`}>
        {icon}
        <p className={`${navButtonStyles.text} text text_type_main-default ml-2`}>{children}</p>
      </a>
    </li>
  );
}

NavButton.propTypes = {
  icon: PropTypes.element.isRequired,
  selected: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
}

export default NavButton;