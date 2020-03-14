
/*
顶部导航组件
*/ 
import React, {useState, useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom'
import { Modal } from 'antd';
import './index.scss';
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import  LinkButton  from '../../components/link-button'
const { confirm } = Modal;

//hooks函数名必须大写开头
const Header = () => {
    let location = useLocation();
    let history = useHistory();
    const [currentTime, setCurrentTime] = useState(formateDate(Date.now())); //当前格式化后的时间
    const [dayPictureUrl, setDayPicture] = useState('');//天气图片
    const [weather, setWeather] = useState('');//天气文本
    const username = memoryUtils.user.username;
    const getWeather = async () => {
        const {dayPictureUrl, weather} = await reqWeather('南阳');
        setDayPicture(dayPictureUrl)
        setWeather(weather)
    }
    const getTitle = () => {
        //获取当前请求路径
        let path = location.pathname;
        let title;
        menuList.forEach(item => {
            if(item.key === path){//如果当前的item的key与path一样， item中的title就是需要显示的title
                title = item.title
            }else if(item.children){
                //在子item中查找
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)=== 0)
                if(cItem){
                    title = cItem.title;
                }
            }
        })
        return title;
    }
    //退出登录
    const logout = () => {

        confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            onOk() {
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 跳转登录
                history.replace('/login')
            }
        });
    }
   //更新时间操作
    useEffect(() => {
         let intervalDate = setInterval(() => {
                const curtime =  formateDate(Date.now());
                setCurrentTime(curtime)
            }, 1000);
        return () => {
            clearInterval(intervalDate)
        }
    });
    //获取天气信息(只有组件挂载后执行一次，[], 否则因为时间更新操作会导致反复获取天气)
    useEffect(() => {
        getWeather();
    }, [])
    
    const title = getTitle() //获取当前菜单的title;
    return (
        <div className="header">
            <div className="header-top">
                <span>欢迎，{username}</span>
                <LinkButton onClick={logout}>退出</LinkButton>
            </div>
            <div className="header-bottom">
                <div className="header-bottom-left">
                    {title}
                </div>
                <div className="header-bottom-right">
                    <span className="">{currentTime}</span>
                    <img src={dayPictureUrl} alt="天气"/>
                    <span className="">{weather}</span>
                </div>

            </div>
        </div>
    );
}

export default Header;
