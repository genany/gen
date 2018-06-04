import {
  Popconfirm,
  Form,
  TreeSelect,
  Input,
  Select,
  Button,
  Tooltip,
  Modal,
  Icon,
  Row,
  Col,
  message
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const TreeNode = TreeSelect.TreeNode;


export default class FileTree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowTemplateModal: false,
      treeData: [],
      value: undefined,
    };
  }
  componentWillReceiveProps(nextProps) {

  }
  componentDidMount(){

  }
  componentWillUnmount(){

  }
  loadData = (treeNode) => {
    return this.props.onLoadData(treeNode);
  }
  onChange = (value) => {
    this.props.onChange(value);
  }
  onSelect = (value, node, extra) => {
    let data = node.props.dataRef;

    if(data.isLeaf){
      this.props.onSelect(value, data, extra);
    }
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      this.props.onLoadData(treeNode.props.dataRef)
      .then(data => {
        treeNode.props.dataRef.children = data;
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      });
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        console.log('key', item.key)

        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} key={item.key} />;
    });
  }
  render() {
    let treeData = this.props.treeData;
    return (
      <span>
        <TreeSelect
          style={{ width: 300 }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择添加模版文件"
          loadData={(node) => this.onLoadData(node)}
          onSelect={this.onSelect}
        >
          {this.renderTreeNodes(treeData)}
        </TreeSelect>
      </span>
    );
  }
}
