import * as React from 'react';

import {TTabName} from '../../utils/types';
import tabStyles from './Tab.module.scss';

interface ITab {
  active: boolean,
  value: TTabName,
  onClick: (value: TTabName) => void,
  children: React.ReactNode
}

const Tab: React.FC<ITab> = ({active, value, onClick: handleClick, children}: ITab) => {
  const className: string = `${tabStyles.root} ${active ? tabStyles.root_type_current : ''}`;
  const onClick = React.useCallback((): void => {
    if (typeof handleClick === 'function') {
      handleClick(value);
    }
  }, [handleClick, value]);

  return (
    <div className={`${className} noselect`} onClick={onClick}>
      <span className="text text_type_main-default">{children}</span>
    </div>
  );
};

export default Tab;
