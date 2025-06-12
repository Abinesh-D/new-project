import React, { useState } from 'react';
import { Tree } from 'antd';

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf 1',
            key: '0-0-0-0',
          },
          {
            title: 'leaf 2',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf 3',
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];

const SampleDisableTree = () => {
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [disabledKeys, setDisabledKeys] = useState([]);

 
  const handleCheck = (checkedKeysValue, { node, checked }) => {
    const updateKeysRecursively = (key, checkState) => {
      const affectedKeys = [];
      const disabledChildrenKeys = [];
      const traverse = (nodes) => {
        nodes.forEach((child) => {
          affectedKeys.push(child.key);
          if (checkState) {
            disabledChildrenKeys.push(child.key); // Disable children when checked
          }
          if (child.children) {
            traverse(child.children);
          }
        });
      };

      const findNode = (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].key === key) {
            traverse(nodes[i].children || []);
            break;
          } else if (nodes[i].children) {
            findNode(nodes[i].children);
          }
        }
      };

      findNode(treeData);

      if (checkState) {
        setDisabledKeys((prev) => [...new Set([...prev, ...disabledChildrenKeys])]);
      } else {
        // Enable children when unchecked
        setDisabledKeys((prev) => prev.filter((key) => !affectedKeys.includes(key)));
      }

      return affectedKeys;
    };

    const affectedKeys = updateKeysRecursively(node.key, checked);

    if (checked) {
      setCheckedKeys([...new Set([...checkedKeysValue, ...affectedKeys, node.key])]);
    } else {
      setCheckedKeys(checkedKeysValue.filter((key) => !affectedKeys.includes(key) && key !== node.key));
    }
  };

  const loopTree = (data) =>
    data.map((item) => ({
      ...item,
      disabled: disabledKeys.includes(item.key),
      children: item.children ? loopTree(item.children) : undefined,
    }));


  return (
    <>
     <div className="page-content">
     {/* <Tree
      checkable
      defaultExpandedKeys={['0-0']}
      checkedKeys={checkedKeys}
      onCheck={handleCheck}
      treeData={loopTree(treeData)}
    /> */}
    </div>
    </>
  );
};

export default SampleDisableTree;
