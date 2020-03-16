/*
动态菜单
*/ 
import React from 'react'

import {
    HomeOutlined ,
    ShoppingOutlined,
    UserOutlined,
    TrophyOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined
    } from '@ant-design/icons';

const menuList = [
    {
        title: '首页',
        icon: <HomeOutlined />,
        key: '/home',
        isPublic: true
    },
    {
        title: '商品',
        icon: <HomeOutlined />,
        key: '/products',
        children: [
            {
                title: '品类管理',
                icon: <HomeOutlined />,
                key: '/category'
            },
            {
                title: '商品管理',
                icon: <ShoppingOutlined />,
                key: '/product'
            },
        ]
    },
    {
        title: '用户管理',
        icon: <UserOutlined />,
        key: '/user'
    },
    {
        title: '角色管理',
        icon: <TrophyOutlined />,
        key: '/role'
    },
    {
        title: '图形图表',
        icon: <HomeOutlined />,
        key: '/charts',
        children: [
            {
                title: '柱形图',
                icon: <BarChartOutlined />,
                key: '/bar'
            },
            {
                title: '折线图',
                icon: <LineChartOutlined />,
                key: '/line'
            },
            {
                title: '饼图',
                icon: <PieChartOutlined />,
                key: '/pie'
            }
        ]
    }
]

export default menuList
