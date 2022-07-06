import React from 'react';

import tabStyles from './Tab.module.scss';

const Tab: React.FC<{
  active: boolean;
  value: string;
  onClick: (value: string) => void;
}> = ({active, value, children, onClick: handleClick}) => {
  const className = `${tabStyles.root} ${active ? tabStyles.root_type_current : ''}`;
  const onClick = React.useCallback(() => {
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
