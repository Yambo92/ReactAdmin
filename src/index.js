/*
入口js
*/

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

//入口就读取localStorage中存储的user信息， 保存到memoryUtils 内存中
const user = storageUtils.getUser()
memoryUtils.user = user;

ReactDOM.render(
    <App />, document.getElementById('root')
)