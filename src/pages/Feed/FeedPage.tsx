import * as React from 'react';

import {TStatusOrders} from '../../utils/types';
import {countOrders} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {wsOrdersAllActions} from '../../services/slices/order';

import Spinner from '../../components/Spinner/Spinner';
import OrderCard from '../../components/OrderCard/OrderCard';

import feedStyles from './FeedPage.module.scss';

const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [statusOrders, setStatusOrders] = React.useState<TStatusOrders>({ready: [], inWork: []});

  const {orders, total, totalToday, wsConnected} = useAppSelector((state) => {
    return state.wsOrdersAll;
  });

  const {type} = useAppSelector((state) => {
    return state.ui;
  });

  React.useEffect(() => {
    dispatch(wsOrdersAllActions.connectionInit());
    return () => {
      dispatch(wsOrdersAllActions.connectionClose());
    }
  }, [dispatch]);

  React.useEffect(() => {
    setStatusOrders(countOrders(orders));
  }, [orders]);

  return (
    <main className={feedStyles.root}>
      {
        (wsConnected ? (
          <>
            {
              type === 'desktop' || type === 'laptop' || type === 'tablet' ? (
                <>
                  <h1 className={`${feedStyles.title} text text_type_main-large`}>
                    Лента заказов
                  </h1>
                  <div className={feedStyles.content}>
                    {
                      orders.length ? (
                        <ul className={feedStyles.orderList}>
                          {
                            orders.map((order): React.ReactNode => {
                              return (
                                <OrderCard
                                  key={order._id}
                                  order={order}
                                  statusIsNeed={false}
                                />
                              );
                            })
                          }
                        </ul>
                      ) : (
                        <p className={`text text_type_main-medium`}>
                          Заказов пока нет 😢
                        </p>
                      )
                    }
                    <div className={feedStyles.ordersBoard}>
                      <div className={feedStyles.readyAndInWorkBlock}>
                        <div className={feedStyles.readyOrdersBlock}>
                          <p className={`${feedStyles.ordersBoardTitle} text text_type_main-medium`}>Готовы:</p>
                          {
                            statusOrders.ready.length ? (
                              <ul className={feedStyles.readyOrdersList}>
                                {
                                  statusOrders.ready.map((orderNumber): React.ReactNode => {
                                    return (
                                      <li className={feedStyles.readyOrdersElement} key={orderNumber}>
                                        <p
                                          className={`${feedStyles.readyOrdersId} text text_type_digits-default text_color_success`}>
                                          {orderNumber}
                                        </p>
                                      </li>
                                    )
                                  })
                                }
                              </ul>
                            ) : (
                              <p className={`text text_type_digits-default`}>
                                0
                              </p>
                            )
                          }
                        </div>
                        <div className={feedStyles.inWorkOrdersBlock}>
                          <p className={`${feedStyles.ordersBoardTitle} text text_type_main-medium`}>В работе:</p>
                          {
                            statusOrders.inWork.length ? (
                              <ul className={feedStyles.inWorkOrdersList}>
                                {
                                  statusOrders.inWork.map((orderNumber): React.ReactNode => {
                                    return (
                                      <li className={feedStyles.inWorkOrdersElement} key={orderNumber}>
                                        <p className={`${feedStyles.inWorkOrdersId} text text_type_digits-default`}>
                                          {orderNumber}
                                        </p>
                                      </li>
                                    );
                                  })
                                }
                              </ul>
                            ) : (
                              <p className={`text text_type_digits-default`}>
                                0
                              </p>
                            )
                          }
                        </div>
                      </div>
                      <div className={feedStyles.completedOrdersBlock}>
                        <p className={`${feedStyles.completedOrdersTitle} text text_type_main-medium`}>
                          Выполнено за все время:
                        </p>
                        <p className={`${feedStyles.completedOrdersDigits} text text_type_digits-large`}>{total}</p>
                      </div>
                      <div className={feedStyles.completedOrdersBlock}>
                        <p className={`${feedStyles.completedOrdersTitle} text text_type_main-medium`}>
                          Выполнено за сегодня:
                        </p>
                        <p className={`${feedStyles.completedOrdersDigits} text text_type_digits-large`}>
                          {totalToday}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                </>
              )
            }
          </>
        ) : (<Spinner/>))
      }
    </main>
  );
}

export default FeedPage;
