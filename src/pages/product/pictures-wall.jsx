import React, {useState, forwardRef, useRef, useImperativeHandle} from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {cloneDeep} from "lodash"
import {reqRemovePic} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

const PicturesWall = forwardRef((props, ref) => {
    const [previewVisible, setPreviewVisible] = useState(false);//是否显示大图预览
    const [previewImage, setPreviewImage] = useState(''); //预览大图的地址
    const [fileList, setFileList] = useState(() => {
        if(props.imgs && props.imgs.length > 0){
            return props.imgs.map((img, index) => ({
                uid: -index,
                name:img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }else{
            return []
        }
    }); //初始化图片数组
    //隐藏Modal
    const handleCancel = () => setPreviewVisible(false);
    //显示指定file对应的大图
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
      };
    //操作过程中（上传/删除）更新fileList状态
    const handleChange = async ({file, fileList }) => {
        // console.log(file.status, file)
        if(file.status === 'done'){
            const result = file.response;
            if(result.status===0){
                message.success('图片上传成功！')
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
                
            }else{
                message.error('图片上传失败！')
            }
        }else if(file.status === 'removed'){ //删除操作
            const result = await reqRemovePic(file.name)
            if(result.status === 0){
                message.success('删除图片成功！')
            }else{
                message.error('删除图片失败！')
            }
        }
        setFileList(cloneDeep(fileList));//hooks必须使用深拷贝（lodash的深拷贝）否则上传文件卡在uploading
    }
  
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
    /*获取已经上传的图片名称列表， 父组件调用子组件的方法：https://stackoverflow.com/questions/37949981/call-child-method-from-parent*/ 
    useImperativeHandle(ref, () => ({
         getImgs(){
            return fileList.map(file => file.name)
        }
    }))
    
    return (
        <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          accept='image/*'
          name="image" //请求参数的名字
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
})

export default PicturesWall;
