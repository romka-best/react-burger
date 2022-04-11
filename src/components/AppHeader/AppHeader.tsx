import React from 'react';
import PropTypes from 'prop-types';

import {Logo, BurgerIcon, ListIcon, ProfileIcon} from '@ya.praktikum/react-developer-burger-ui-components';
import NavButton from '../NavButton/NavButton';

import headerStyles from './AppHeader.module.css';

const AppHeader = ({currentPage}) => {
  return (
    <header className={`${headerStyles.root} pt-4 pb-4`}>
      <nav className={headerStyles.navigation}>
        <ul className={`${headerStyles.navButtons} ${headerStyles.navButtons_left}`}>
          {currentPage === "Конструктор" ? (
            <NavButton icon={(<BurgerIcon type={"primary"}/>)} selected>Конструктор</NavButton>
          ) : (<NavButton icon={(<BurgerIcon type={"secondary"}/>)} selected={false}>Конструктор</NavButton>)}
          {currentPage === "Лента заказов" ? (
            <NavButton icon={(<ListIcon type={"primary"}/>)} selected>Лента заказов</NavButton>
          ) : (<NavButton icon={(<ListIcon type={"secondary"}/>)} selected={false}>Лента заказов</NavButton>)}
        </ul>
        <Logo/>
        <ul className={`${headerStyles.navButtons} ${headerStyles.navButtons_right}`}>
          {currentPage === "Личный кабинет" ? (
            <NavButton icon={(<ProfileIcon type={"primary"}/>)} selected>Личный кабинет</NavButton>
          ) : (<NavButton icon={(<ProfileIcon type={"secondary"}/>)} selected={false}>Личный кабинет</NavButton>)}
        </ul>
      </nav>
    </header>
  );
}

AppHeader.propTypes = {
  currentPage: PropTypes.string.isRequired,
}

export default AppHeader;