/*
应用中所有接口的请求函数
*/ 

import ajax from './ajax'


//登录
export const reqLogin = (username, password) => 
         ajax('/login', {username, password}, 'POST')

//新增用户
export const reqAddUser = (user) => 
        ajax('/manage/user/add', user, 'POST')

//更新用户
export const reqUpdateUser = (user) => 
        ajax('/manage/user/update', user, 'POST')


