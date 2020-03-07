/*
发送异步ajax请求的函数
封装 axios
函数返回值是promise对象
1: 优化： 统一处理请求异常
*/ 

import axios from 'axios'
import { message } from 'antd';

export default  function ajax(url, data={}, type='GET'){
    return new Promise((resolve, reject) => {
        let promise;
        //1: 执行ajax请求
        if(type === 'GET'){
            promise = axios.get(url, {
                params: data //指定请求参数
            })
        } else {
            promise = axios.post(url, data)
        }
        
        promise.then(response => {//2:请求成功resolve()
            resolve(response.data)
        }).catch(error => {//3:处理请求异常reject() 提示错误信息
            message.error('请求出错了：' + error.message);
        })
    })
}
