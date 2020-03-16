/*
左侧导航组件
*/ 

import React, {useState} from 'react'
import './index.scss'
import logo from '../../assets/images/logo.png'
import {Link, useLocation} from 'react-router-dom'
import { Menu } from 'antd';
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
const { SubMenu } = Menu;
export const LeftNav = () => {
    let openKey; //获取默认sub展开菜单key;
    let menuNode; //meun节点dom
    let location = useLocation();
    let path = location.pathname;
    const hasAuth = (item) => {
        /*判断key是否在menus*/ 
        const key = item.key
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        if(username === 'admin' || item.isPublic || menus.indexOf(key) !== -1){
            return true
        }else if(item.children){ //如果当前用户有此item的的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false

    }
    /*
        根据数据数组生成标签数组(使用map和递归调用)
    */
    const getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{
                 //查找与当前路由匹配的子item
                const cItem = item.children.find(cItem => cItem.key === path)
                //如果cItem存在说明当前item对应的子列表需要展开
                if(cItem){
                    openKey = item.key;
                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            {item.icon}
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
          
        })
    }

    /*
    使用reduce生成列表
    */ 
   const getMenuNodes = (menuList) => {
       return menuList.reduce((pre, item) => {
           //如果当前用户有item对应的权限， 才需要显示对应的菜单项
           if(hasAuth(item)){
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            }else{
                //查找与当前路由匹配的子item
                
               const cItem = item.children.find(cItem =>  path.indexOf(cItem.key)===0)
               //如果cItem存在说明当前item对应的子列表需要展开
                if(cItem){
                    openKey = item.key;
                }
                pre.push(
                    (
                        <SubMenu
                            key={item.key}
                            title={
                            <span>
                                {item.icon}
                                <span>{item.title}</span>
                            </span>
                            }
                        >
                            {getMenuNodes(item.children)}
                        </SubMenu>
                    )
                )
            }
            
           }
           return pre
       },[])
   }
   //由于hooks去掉了componentwillmount，所以就直接写在这里， 因为必须在挂载之前获取menudom 而且必须同步执行
    menuNode = getMenuNodes(menuList)
    if(path.indexOf('/product')===0){
        path = "/product"
    }
    return (
        <div className="left-nav">
            <Link to="/">
                <header className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台管理</h1>
                </header>
            </Link>
            <Menu
                selectedKeys={[path]}
                defaultOpenKeys={[openKey]}	
                mode="inline"
                theme="dark"
            >
            {menuNode}
        </Menu>
        </div>
    )
}


export default LeftNav;