import React from 'react';
import {NavLink, Link, useHistory, useRouteMatch} from 'react-router-dom';

import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  MenuIcon,
  CloseIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import LogoMobile from '../../assets/images/logo.svg';

import {ReducersParams} from '../../utils/types';
import {exit} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';

import headerStyles from './AppHeader.module.scss';

const AppHeader = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const [navigationMenu, setNavigationMenu] = React.useState<{ isOpen: boolean, isExpanded: boolean }>({
    isOpen: false,
    isExpanded: false,
  });

  const pages = {
    isMainPage: useRouteMatch({
      path: '/',
      strict: true,
      sensitive: true
    }),
    isFeedPage: useRouteMatch({
      path: '/feed',
      strict: false,
      sensitive: false
    }),
    isProfilePage: useRouteMatch({
      path: '/profile',
      strict: false,
      sensitive: false
    })
  };

  const closeExpandedMenu = () => {
    setNavigationMenu({
      ...navigationMenu,
      isOpen: false,
      isExpanded: false
    })
  };

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
                    {pages.isMainPage?.isExact ?
                      (<BurgerIcon type={'primary'}/>) :
                      (<BurgerIcon type={'secondary'}/>)}
                    <p className={`${headerStyles.navButtonText} text text_type_main-default`}>??????????????????????</p>
                  </NavLink>
                </li>
                <li className={`${headerStyles.navButton}`}>
                  <NavLink
                    to={{pathname: '/feed'}}
                    className={`${headerStyles.navButtonLink} text text_type_main-default text_color_inactive`}
                    activeClassName={`${headerStyles.navButton_selected} `}
                  >
                    {pages.isFeedPage?.path === '/feed' ?
                      (<ListIcon type={'primary'}/>) :
                      (<ListIcon type={'secondary'}/>)}
                    <p className={`${headerStyles.navButtonText} text text_type_main-default`}>?????????? ??????????????</p>
                  </NavLink>
                </li>
              </ul>
              <Link to={{pathname: '/'}}>
                <Logo/>
              </Link>
              <ul className={`${headerStyles.navButtons} ${headerStyles.navButtons_right}`}>
                <li className={`${headerStyles.navButton}`}>
                  <NavLink
                    to={{pathname: '/profile'}}
                    className={`${headerStyles.navButtonLink} text text_type_main-default text_color_inactive`}
                    activeClassName={`${headerStyles.navButton_selected}`}
                  >
                    {pages.isProfilePage?.path === '/profile' ?
                      (<ProfileIcon type={'primary'}/>) :
                      (<ProfileIcon type={'secondary'}/>)}
                    <p className={`${headerStyles.navButtonText} text text_type_main-default`}>???????????? ??????????????</p>
                  </NavLink>
                </li>
              </ul>
            </>
          ) : type === 'mobile' && (
            navigationMenu.isOpen ? (
              <div className={headerStyles.rootExpandedMenu}>
                <div className={headerStyles.expandedMenuHeader}>
                  <h2 className={`${headerStyles.expandedMenuTitle} text text_type_main-medium`}>
                    ????????
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
                      {pages.isProfilePage?.path === '/profile' ?
                        (<ProfileIcon type={'primary'}/>) :
                        (<ProfileIcon type={'secondary'}/>)}
                      <p className={`${headerStyles.expandedMenuPageText} text text_type_main-default`}>????????????
                        ??????????????</p>
                      <div className={headerStyles.expandedMenuIconArrow} onClick={(evt: React.SyntheticEvent) => {
                        evt.stopPropagation();
                        evt.preventDefault();
                      }}>
                        {
                          navigationMenu.isExpanded ? (
                            pages.isProfilePage?.path === '/profile' ?
                              (<ArrowUpIcon type={'primary'} onClick={() => setNavigationMenu({
                                ...navigationMenu,
                                isExpanded: false,
                              })}/>) :
                              (<ArrowUpIcon type={'secondary'} onClick={() => setNavigationMenu({
                                ...navigationMenu,
                                isExpanded: false,
                              })}/>)
                          ) : pages.isProfilePage?.path === '/profile' ?
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
                                ??????????????
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
                                ?????????????? ??????????????
                              </p>
                            </NavLink>
                          </li>
                          <li className={headerStyles.expandedMenuSubPageButton} onClick={() => {
                            exit(dispatch, history);
                            closeExpandedMenu();
                          }}>
                            <p
                              className={`${headerStyles.expandedMenuSubPageText} text text_type_main-default text_color_inactive`}>
                              ??????????
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
                      {pages.isMainPage?.isExact ?
                        (<BurgerIcon type={'primary'}/>) :
                        (<BurgerIcon type={'secondary'}/>)}
                      <p className={`${headerStyles.expandedMenuPageText} text text_type_main-default`}>
                        ?????????????????????? ????????????????
                      </p>
                    </NavLink>
                  </li>
                  <li className={headerStyles.expandedMenuPageButton}>
                    <NavLink
                      to={{pathname: '/feed'}}
                      className={`${headerStyles.expandedMenuPage} text text_type_main-default text_color_inactive`}
                      activeClassName={`${headerStyles.expandedMenuPage_selected}`}
                      onClick={closeExpandedMenu}
                    >
                      {pages.isFeedPage?.isExact ?
                        (<ListIcon type={'primary'}/>) :
                        (<ListIcon type={'secondary'}/>)}
                      <p className={`${headerStyles.expandedMenuPageText} text text_type_main-default`}>
                        ?????????? ??????????????
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