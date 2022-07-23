import React from 'react';
import PropTypes from 'prop-types';
import {DropTargetMonitor, useDrag, useDrop} from 'react-dnd';

import {
  DragIcon,
  ConstructorElement,
  LockIcon
} from '@ya.praktikum/react-developer-burger-ui-components';

import ConstructorElementMobile from '../ConstructorElementMobile/ConstructorElementMobile';

import {ingredientDetailsPropTypes, IngredientParams, ItemParams, ReducersParams} from '../../utils/types';
import {useAppSelector} from '../../services/store';

import burgerConstructorElementStyles from './BurgerConstructorElement.module.scss';

interface BurgerConstructorElementProps {
  product: IngredientParams,
  index: number,
  deleteIngredient: Function,
  moveBurgerConstructorIngredient: Function
}

const BurgerConstructorElement = ({
                                    product,
                                    index,
                                    deleteIngredient,
                                    moveBurgerConstructorIngredient
                                  }: BurgerConstructorElementProps) => {
  const {
    name,
    price,
    image,
    type,
    image_mobile
  } = product;

  const {type: typeDevice} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const [{isDragging}, dragRef] = useDrag({
    type: 'BURGER_CONSTRUCTOR_INGREDIENT',
    item: {index},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{canDrop}, dropRef] = useDrop({
    accept: 'BURGER_CONSTRUCTOR_INGREDIENT',
    hover: (item: ItemParams, monitor: DropTargetMonitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      const hoverBoundingRect = ref.current?.getBoundingClientRect()!;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverActualY = monitor.getClientOffset()!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      moveBurgerConstructorIngredient(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => {
      return ({
        canDrop: monitor.canDrop()
      })
    }
  });

  const ref = React.useRef<HTMLLIElement>(null);
  const dragDropRef = dragRef(dropRef(ref));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <>
      {typeDevice === 'desktop' || typeDevice === 'laptop' || typeDevice === 'tablet' ? (
        // @ts-ignore
        <li ref={dragDropRef}
            className={`${burgerConstructorElementStyles.root} ${canDrop ? burgerConstructorElementStyles.rootCanDrop : ''}`}
            style={{opacity}}>
          <DragIcon type={'primary'}/>
          <ConstructorElement
            isLocked={false}
            text={name}
            price={price}
            thumbnail={image}
            handleClose={() => deleteIngredient(product._id)}
          />
        </li>
      ) : (
        // @ts-ignore
        <li ref={type !== 'bun' ? dragDropRef : null}
            className={`${burgerConstructorElementStyles.root} ${canDrop ? burgerConstructorElementStyles.rootCanDrop : ''}`}
            style={{opacity}}>
          <div className={burgerConstructorElementStyles.icon}>
            {type === 'bun' ? (<LockIcon type={'primary'}/>) : (<DragIcon type={'primary'}/>)}
          </div>
          <ConstructorElementMobile
            text={name}
            price={price}
            thumbnail={image_mobile}
          />
        </li>
      )}
    </>
  );
}

BurgerConstructorElement.propTypes = {
  product: ingredientDetailsPropTypes.isRequired,
  index: PropTypes.number.isRequired,
  deleteIngredient: PropTypes.func.isRequired,
}

export default BurgerConstructorElement;