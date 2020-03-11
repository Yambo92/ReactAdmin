/*
应用中所有接口的请求函数
*/ 

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

//登录
export const reqLogin = (username, password) => 
         ajax('/login', {username, password}, 'POST')

//新增用户
export const reqAddUser = (user) => 
        ajax('/manage/user/add', user, 'POST')

//更新用户
export const reqUpdateUser = (user) => 
        ajax('/manage/user/update', user, 'POST')


/*
根据jsonp请求的接口（jsonp只适合与解决跨域的get请求）
原理：
浏览器：
	动态生成script标签来请求后台接口（src的值就是url）
	定义好用于接收响应数据的函数（fn）, 并将函数名通过请求参数提交给后台（如：callback=fn）
服务器端：
	接收到请求处理产生结果数据后， 返回一个函数调用的js代码， 并将结果数据作为实参传入函数调用
浏览器端：
	收到响应自动执行函数调用的js代码， 也就执行了提前定义好的函数，并得到了数据

*/ 

export const reqWeather = (city) => {
	return new Promise((resolve, reject) => {
		const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
		jsonp(url, {}, (err, data) => {
			// console.log('jsonp()', err, data)
			//请求成功
			if(!err && data.status === 'success'){
				const {weather, dayPictureUrl} = data.results[0].weather_data[0]
				resolve({weather, dayPictureUrl})
			}else{//请求失败
				message.error('天气信息获取失败！')
			}
			
		})
	})
	
}

/*
商品分类
*/ 
/*
获取分类列表
*/ 
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId}, 'GET')

/* 添加分类 */ 
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST')

/* 更新分类 */ 
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

/* 根据ID查找分类 */ 
export const reqFindCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

/*
商品
*/ 
/*获取商品分页列表*/ 
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

/*根据ID/Name搜索产品分页列表 searchType的值为[productName 或者 productDesc]*/ 
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search', 
	{
		pageNum,
		pageSize,
		[searchType]:searchName,
	})

/*根据分类ID获取分类*/ 
export const reqGetCategoryName = (categoryId) => ajax('/manage/category/info', {categoryId})
/*商品上架下架*/ 
export const reqUpdateStatus = ({productId, status}) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')
/*删除图片*/ 
export const reqRemovePic = (name) => ajax('/manage/img/delete', {name}, 'POST')

/*添加商品*/
export const reqAddProduct = ({
	categoryId, pCategoryId, name, desc, price, detail, imgs
	}) => ajax('/manage/product/add',{categoryId, pCategoryId, name, desc, price, detail, imgs}, 'POST') 
/*更新商品*/
export const reqUpdateProduct = ({
	_id, categoryId, pCategoryId, name, desc, price, detail, imgs
	}) => ajax('/manage/product/update',{_id, categoryId, pCategoryId, name, desc, price, detail, imgs}, 'POST') 
