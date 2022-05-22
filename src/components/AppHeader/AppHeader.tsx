import PropTypes from 'prop-types';

import {Logo, BurgerIcon, ListIcon, ProfileIcon, MenuIcon} from '@ya.praktikum/react-developer-burger-ui-components';
import LogoMobile from '../../assets/images/logo.svg';

import NavButton from '../NavButton/NavButton';

import headerStyles from './AppHeader.module.scss';
import {ReducersParams} from '../../utils/types';
import {useAppSelector} from '../../services/store';

interface AppHeaderProps {
  currentPage: string
}

const AppHeader = ({currentPage}: AppHeaderProps) => {

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  return (
    <header className={headerStyles.root}>
      <nav className={headerStyles.navigation}>
        {
          type === 'desktop' || type === 'tablet' || type === 'laptop' ? (
            <>
              <ul className={`${headerStyles.navButtons} ${headerStyles.navButtons_left}`}>
                {currentPage === 'Конструктор' ? (
                  <NavButton icon={(<BurgerIcon type={'primary'}/>)} selected>Конструктор</NavButton>
                ) : (<NavButton icon={(<BurgerIcon type={'secondary'}/>)} selected={false}>Конструктор</NavButton>)}
                {currentPage === 'Лента заказов' ? (
                  <NavButton icon={(<ListIcon type={'primary'}/>)} selected>Лента заказов</NavButton>
                ) : (<NavButton icon={(<ListIcon type={'secondary'}/>)} selected={false}>Лента заказов</NavButton>)}
              </ul>
              <Logo/>
              <ul className={`${headerStyles.navButtons} ${headerStyles.navButtons_right}`}>
                {currentPage === 'Личный кабинет' ? (
                  <NavButton icon={(<ProfileIcon type={'primary'}/>)} selected>Личный кабинет</NavButton>
                ) : (<NavButton icon={(<ProfileIcon type={'secondary'}/>)} selected={false}>Личный кабинет</NavButton>)}
              </ul>
            </>
          ) : type === 'mobile' && (
            <>
              <ul className={headerStyles.navButtons}>
                <li className={headerStyles.logoButton}>
                  <img src={LogoMobile} alt={'React Burgers'} className={headerStyles.logoButtonImage}/>
                </li>
                <li className={headerStyles.menuButton}>
                  <MenuIcon type='primary'/>
                </li>
              </ul>
            </>
          )
        }
      </nav>
    </header>
  );
}

AppHeader.propTypes = {
  currentPage: PropTypes.string.isRequired,
}

export default AppHeader;