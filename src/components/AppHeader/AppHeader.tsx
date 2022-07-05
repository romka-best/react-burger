import React, {SyntheticEvent} from 'react';
import {NavLink, useHistory, useRouteMatch} from 'react-router-dom';

import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  MenuIcon,
  CloseIcon, ArrowDownIcon, ArrowUpIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import LogoMobile from '../../assets/images/logo.svg';

import {ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {logout} from '../../services/slices/user';

import headerStyles from './AppHeader.module.scss';

const AppHeader = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [navigationMenu, setNavigationMenu] = React.useState<{ isOpen: boolean, isExpanded: boolean }>({
    isOpen: false,
    isExpanded: false,
  });

  const isMainPage = useRouteMatch({
    path: '/',
    strict: true,
    sensitive: true
  });

  const isOrdersPage = useRouteMatch({
    path: '/orders',
    strict: false,
    sensitive: false
  });

  const isProfilePage = useRouteMatch({
    path: '/profile',
    strict: false,
    sensitive: false
  });

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const exit = () => {
    dispatch(logout())
      .unwrap()
      .then((res) => {
        if (res.success) {
          history.replace({pathname: '/login'});
        }
      });
  }

  const closeExpandedMenu = () => {
    setNavigationMenu({
      ...navigationMenu,
      isOpen: false,
      isExpanded: false
    })
  }

  return (
    <header className={headerStyles.root}>
      <nav className={headerStyles.navigation}>
        {
          type === 'desktop' || type === 'tablet' || type === 'laptop' ? (
            <>
              <ul className={`${headerStyles.navButtons} ${headerStyles.navButtons_left}`}>
                <li className={`${headerStyles.navButton}`}>
                  <NavLink
                    to={{pathname: '/'}}
                    className={`${headerStyles.navButtonLink} text text_type_main-default text_color_inactive`}
                    activeClassName={`${headerStyles.navButton_selected}`}
                    exact={true}
                  >
                    {isMainPage?.isExact ?
                      (<BurgerIcon type={'primary'}/>) :
                      (<BurgerIcon type={'secondary'}/>)}
                    <p className={`${headerStyles.navButtonText} text text_type_main-default`}>Конструктор</p>
                  </NavLink>
                </li>
                <li className={`${headerStyles.navButton}`}>
                  <NavLink
                    to={{pathname: '/orders'}}
                    className={`${headerStyles.navButtonLink} text text_type_main-default text_color_inactive`}
                    activeClassName={`${headerStyles.navButton_selected} `}
                  >
                    {isOrdersPage?.isExact ?
                      (<ListIcon type={'primary'}/>) :
                      (<ListIcon type={'secondary'}/>)}
                    <p className={`${headerStyles.navButtonText} text text_type_main-default`}>Лента заказов</p>
                  </NavLink>
                </li>
              </ul>
              <Logo/>
              <ul className={`${headerStyles.navButtons} ${headerStyles.navButtons_right}`}>
                <li className={`${headerStyles.navButton}`}>
                  <NavLink
                    to={{pathname: '/profile'}}
                    className={`${headerStyles.navButtonLink} text text_type_main-default text_color_inactive`}
                    activeClassName={`${headerStyles.navButton_selected}`}
                  >
                    {isProfilePage?.path === '/profile' ?
                      (<ProfileIcon type={'primary'}/>) :
                      (<ProfileIcon type={'secondary'}/>)}
                    <p className={`${headerStyles.navButtonText} text text_type_main-default`}>Личный кабинет</p>
                  </NavLink>
                </li>
              </ul>
            </>
          ) : type === 'mobile' && (
            navigationMenu.isOpen ? (
              <div className={headerStyles.rootExpandedMenu}>
                <div className={headerStyles.expandedMenuHeader}>
                  <h2 className={`${headerStyles.expandedMenuTitle} text text_type_main-medium`}>
                    Меню
                  </h2>
                  <CloseIcon type={'primary'} onClick={() => {
                    setNavigationMenu({...navigationMenu, isOpen: false})
                  }}/>
                </div>
                <ul className={headerStyles.expandedMenuPages}>
                  <li className={headerStyles.expandedMenuPageButton}>
                    <NavLink
                      to={{pathname: '/profile'}}
                      className={`${headerStyles.expandedMenuPage} text text_type_main-default text_color_inactive`}
                      activeClassName={`${headerStyles.expandedMenuPage_selected}`}
                      onClick={closeExpandedMenu}
                    >
                      {isProfilePage?.path === '/profile' ?
                        (<ProfileIcon type={'primary'}/>) :
                        (<ProfileIcon type={'secondary'}/>)}
                      <p className={`${headerStyles.expandedMenuPageText} text text_type_main-default`}>Личный
                        кабинет</p>
                      <div className={headerStyles.expandedMenuIconArrow} onClick={(evt: SyntheticEvent) => {
                        evt.stopPropagation();
                        evt.preventDefault();
                      }}>
                        {
                          navigationMenu.isExpanded ? (
                            isProfilePage?.path === '/profile' ?
                              (<ArrowUpIcon type={'primary'} onClick={() => setNavigationMenu({
                                ...navigationMenu,
                                isExpanded: false,
                              })}/>) :
                              (<ArrowUpIcon type={'secondary'} onClick={() => setNavigationMenu({
                                ...navigationMenu,
                                isExpanded: false,
                              })}/>)
                          ) : isProfilePage?.path === '/profile' ?
                            (<ArrowDownIcon type={'primary'} onClick={() => setNavigationMenu({
                              ...navigationMenu,
                              isExpanded: true,
                            })}/>) :
                            (<ArrowDownIcon type={'secondary'} onClick={() => setNavigationMenu({
                              ...navigationMenu,
                              isExpanded: true,
                            })}/>)
                        }
                      </div>
                    </NavLink>
                    {
                      navigationMenu.isExpanded ? (
                        <ul className={headerStyles.expandedMenuSubPages}>
                          <li className={headerStyles.expandedMenuSubPageButton}>
                            <NavLink
                              to={{pathname: `/profile`}}
                              className={`${headerStyles.expandedMenuSubPage} text text_type_main-default text_color_inactive`}
                              activeClassName={`${headerStyles.expandedMenuSubPage_selected}`}
                              exact={true}
                              onClick={closeExpandedMenu}
                            >
                              <p
                                className={`${headerStyles.expandedMenuSubPageText} text text_type_main-default`}>
                                Профиль
                              </p>
                            </NavLink>
                          </li>
                          <li className={headerStyles.expandedMenuSubPageButton}>
                            <NavLink
                              to={{pathname: `/profile/orders`}}
                              className={`${headerStyles.expandedMenuSubPage} text text_type_main-default text_color_inactive`}
                              activeClassName={`${headerStyles.expandedMenuSubPage_selected}`}
                              exact={true}
                              onClick={closeExpandedMenu}
                            >
                              <p
                                className={`${headerStyles.expandedMenuSubPageText} text text_type_main-default`}>
                                История заказов
                              </p>
                            </NavLink>
                          </li>
                          <li className={headerStyles.expandedMenuSubPageButton} onClick={exit}>
                            <p
                              className={`${headerStyles.expandedMenuSubPageText} text text_type_main-default text_color_inactive`}>
                              Выход
                            </p>
                          </li>
                        </ul>
                      ) : null
                    }
                  </li>
                  <li className={headerStyles.expandedMenuPageButton}>
                    <NavLink
                      to={{pathname: '/'}}
                      className={`${headerStyles.expandedMenuPage} text text_type_main-default text_color_inactive`}
                      activeClassName={`${headerStyles.expandedMenuPage_selected}`}
                      exact={true}
                      onClick={closeExpandedMenu}
                    >
                      {isMainPage?.isExact ?
                        (<BurgerIcon type={'primary'}/>) :
                        (<BurgerIcon type={'secondary'}/>)}
                      <p className={`${headerStyles.expandedMenuPageText} text text_type_main-default`}>
                        Конструктор бургеров
                      </p>
                    </NavLink>
                  </li>
                  <li className={headerStyles.expandedMenuPageButton}>
                    <NavLink
                      to={{pathname: '/orders'}}
                      className={`${headerStyles.expandedMenuPage} text text_type_main-default text_color_inactive`}
                      activeClassName={`${headerStyles.expandedMenuPage_selected}`}
                      onClick={closeExpandedMenu}
                    >
                      {isOrdersPage?.isExact ?
                        (<ListIcon type={'primary'}/>) :
                        (<ListIcon type={'secondary'}/>)}
                      <p className={`${headerStyles.expandedMenuPageText} text text_type_main-default`}>
                        Лента заказов
                      </p>
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <ul className={headerStyles.navButtons}>
                <li className={headerStyles.logoButton}>
                  <img src={LogoMobile} alt={'React Burgers'} className={headerStyles.logoButtonImage}/>
                </li>
                <li className={headerStyles.menuButton}>
                  <MenuIcon type='primary' onClick={() => {
                    setNavigationMenu({
                      ...navigationMenu,
                      isOpen: true
                    });
                  }}/>
                </li>
              </ul>
            )
          )
        }
      </nav>
    </header>
  );
}

export default AppHeader;