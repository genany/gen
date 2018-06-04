import { Tree, Input } from 'antd';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ label: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);


const dataList = [];
const transList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    // const key = node.key;
    dataList.push(node);
    if (node.children) {
      transList(node.children);
    }
  }
};
// transList(gData);
// console.log(gData)
// console.log(dataList)

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default class ComponentTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  }
  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      // console.log(nextProps.data)
      dataList.length = 0;
      transList(nextProps.data);
    }
    if(nextProps.currComponent){
      this.componentExpand(nextProps.currComponent);
    }
  }
  componentExpand = (component) => {
    let expandedKeys = dataList.map((item) => {
      if (item.key == component.key) {
        return getParentKey(item.key, this.props.data);
      }
      return null;
    })

    this.setState({
      expandedKeys: expandedKeys,
      autoExpandParent: true,
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    // this.props.onSelectNode();
    if(info.selected && info.selectedNodes.length){
      let key = info.selectedNodes[0].key;
      let selectNode = dataList.find(item => item.key == key);
      this.props.onSelectNode(selectNode);
    }
  }

  onChange = (e) => {
    const value = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.label.indexOf(value) > -1) {
        return getParentKey(item.key, this.props.data);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }
  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const gData = this.props.data;
    const loop = data => data.map((item) => {
      const index = item.label.indexOf(searchValue);
      const beforeStr = item.label.substr(0, index);
      const afterStr = item.label.substr(index + searchValue.length);
      const label = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.label}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={label}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.label} title={label} />;
    });
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          onSelect={this.onSelect}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {loop(gData)}
        </Tree>
      </div>
    );
  }
}
