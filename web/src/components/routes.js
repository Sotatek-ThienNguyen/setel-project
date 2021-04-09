import React from 'react';
import ListOrders from './Order/ListOrders';
import OrderDetail from './Order/OrderDetail';

const routes = [
    {
        path : '/',
        exact : true,
        main : ({ match }) => <ListOrders match={match}/>
    },
    {
        path : '/order/:id',
        exact : false,
        main : ({ match, location }) => <OrderDetail match={match} location={location} />
    }
];

export default routes;
