import React from 'react';
import {DragSourceMonitor, DropTargetMonitor, useDrag, useDrop} from 'react-dnd';

import {
  DragIcon,
  ConstructorElement,
  LockIcon
} from '@ya.praktikum/react-developer-burger-ui-components';

import ConstructorElementMobile from '../ConstructorElementMobile/ConstructorElementMobile';

import {TIngredient, TReducerState} from '../../utils/types';
import {useAppSelector} from '../../services/store';

import {TDragObject, TDragResult, TDropResult} from './BurgerConstructorElementTypes';
import burgerConstructorElementStyles from './BurgerConstructorElement.module.scss';

interface IBurgerConstructorElement {
  product: TIngredient,
  index: number,
  deleteIngredient: Function,
  moveBurgerConstructorIngredient: Function
}

const BurgerConstructorElement: React.FC<IBurgerConstructorElement> = ({
                                                                         product,
                                                                         index,
                                                                         deleteIngredient,
                                                                         moveBurgerConstructorIngredient
                                                                       }: IBurgerConstructorElement) => {
  const {
    name,
    price,
    image,
    type,
    image_mobile
  } = product;

  const {type: typeDevice} = useAppSelector((state: TReducerState) => {
    return state.ui;
  });

  const [{isDragging}, dragRef] = useDrag<TDragObject, unknown, TDragResult>({
    type: 'BURGER_CONSTRUCTOR_INGREDIENT',
    item: {index},
    collect: (monitor: DragSourceMonitor<TDragObject>): TDragResult => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{canDrop}, dropRef] = useDrop<TDragObject, unknown, TDropResult>({
    accept: 'BURGER_CONSTRUCTOR_INGREDIENT',
    hover: (item: TDragObject, monitor: DropTargetMonitor<TDragObject>): void => {
      const dragIndex: number = item.index;
      const hoverIndex: number = index;
      const hoverBoundingRect: DOMRect = ref.current?.getBoundingClientRect()!;
      const hoverMiddleY: number = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverActualY: number = monitor.getClientOffset()!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      moveBurgerConstructorIngredient(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor: DropTargetMonitor<TDragObject>): TDropResult => {
      return ({
        canDrop: monitor.canDrop()
      })
    }
  });

  const ref = React.useRef<HTMLLIElement>(null);
  const dragDropRef = dragRef(dropRef(ref)) as React.LegacyRef<HTMLLIElement>;

  const opacity = isDragging ? 0.5 : 1;

  return (
    <>
      {typeDevice === 'desktop' || typeDevice === 'laptop' || typeDevice === 'tablet' ? (
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

export default BurgerConstructorElement;