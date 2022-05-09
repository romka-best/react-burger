import React from 'react';
import PropTypes from 'prop-types';

import {useDrag, useDrop} from 'react-dnd';

import {
  DragIcon,
  ConstructorElement
} from '@ya.praktikum/react-developer-burger-ui-components';

import {ingredientDetailsPropTypes, ItemParams} from '../../utils/types';

import burgerConstructorElementStyles from './BurgerConstructorElement.module.css';

const BurgerConstructorElement = ({product, index, deleteIngredient, moveBurgerConstructorIngredient}) => {
  const {
    name,
    price,
    image,
  } = product;

  const [{isDragging}, dragRef] = useDrag({
    type: 'burgerConstructorIngredient',
    item: {index},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'burgerConstructorIngredient',
    hover: (item: ItemParams, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      const hoverBoundingRect = ref.current?.getBoundingClientRect()!;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // @ts-ignore
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      moveBurgerConstructorIngredient(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const ref = React.useRef<HTMLLIElement>(null);
  const dragDropRef = dragRef(dropRef(ref));

  const opacity = isDragging ? 0.5 : 1;

  return (
    // @ts-ignore
    <li ref={dragDropRef} className={`${burgerConstructorElementStyles.root} mr-4`}
        style={{opacity}}>
      <DragIcon type={'primary'}/>
      <ConstructorElement
        isLocked={false}
        text={name}
        price={price}
        thumbnail={image}
        handleClose={() => deleteIngredient(product._id)
        }
      />
    </li>
  );
}

BurgerConstructorElement.propTypes = {
  product: ingredientDetailsPropTypes.isRequired,
  index: PropTypes.number.isRequired,
  deleteIngredient: PropTypes.func.isRequired,
}

export default BurgerConstructorElement;