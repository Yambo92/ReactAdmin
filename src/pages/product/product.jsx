/*
产品分类路由组件
*/ 

import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './add-product'
import ProductDetail from './detail-product'
import "./product.scss"
export const Product = () => {

    return(
        <Switch>
            <Route exact path="/product" component={ProductHome} />
            <Route path="/product/addupdate" component={ProductAddUpdate} />
            <Route path="/product/detail" component={ProductDetail} />
            <Redirect to="/product" />
        </Switch>
    )
}

export default Product