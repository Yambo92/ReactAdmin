/*设置权限组件*/ 
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
    Form,
    Input,
    Tree
} from 'antd'
import menuList from '../../config/menuConfig'
import { getNodeText } from '@testing-library/react';

const { TreeNode } = Tree;

const AuthForm = forwardRef((props, ref) => {
  const {role, checkedKeys} = props
//   const [checkedKeys, setCheckedKeys] = useState(role.menus);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeNode, setTreeNode] = useState(() => {
    const getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            item.children ?
            pre.push({
                title: item.title, 
                key:item.key,
                children: getTreeNodes(item.children)
                }) :
            pre.push({
                title: item.title, 
                key:item.key,
            })
    
            return pre
        },[])
     }
     return getTreeNodes(menuList)
  });
  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setAutoExpandParent(false);
  };

  const onCheck = checkedKeys => {
    // console.log('onCheck', checkedKeys);
    // setCheckedKeys(checkedKeys);
    props.onCheck(checkedKeys)
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeys);
  };
  useImperativeHandle(ref, () => ({
        getCheckedTree(){
            return checkedKeys
        }
  }))

//  useEffect(() => {//选中的权限依赖于props传来的角色name
//     setCheckedKeys(role.menus)
//  }, [role.name]);

    return (
        <div>
            <Form>
                <Form.Item 
                    label="角色名称"
                    labelCol={{span:4}}
                    wrapperCol={{span:18}}
                >
                    <Input value={role.name} disabled />
                </Form.Item>
            </Form>
            <Tree
                checkable
                onExpand={onExpand}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={treeNode}
                defaultExpandAll={true} //设置默认全部展开，那么就不能在初始化时设置expandedKeys
                />
        </div>
        
    );
})

export default AuthForm;
