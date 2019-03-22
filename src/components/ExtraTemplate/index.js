import React from 'react';
import { Popconfirm, message, Input, Icon, Row, Col } from 'antd';
import { uuid } from '../../utils/utils.js';
import { zh2En } from '../../utils/utils.js';
import CodeArea from '../CodeArea';
import FileTree from '../FileTree';

const { TextArea } = Input;

export default class ExtraTemplate extends React.Component {
  constructor(props) {
    super(props);

    const value = [...this.props.value] || [];
    this.state = {
      currExtra: null,
      extra: value,
      files: [],
      scaffoldDir: ''
    };
  }
  componentWillReceiveProps(nextProps, prevProps) {
    if ('value' in nextProps) {
      this.setState({ extra: nextProps.value });
    }
    if (nextProps.scaffoldDir && nextProps.scaffoldDir !== this.state.scaffoldDir) {
      this.setState({ scaffoldDir: nextProps.scaffoldDir }, () => {
        this.getSubFiles();
      });
    }
  }
  componentDidMount() {
    // if()
    // this.getSubFiles()
  }
  componentWillUnmount() {}

  getSubFiles = node => {
    if (!this.props.scaffoldDir) return;
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: 'scaffold/files',
        payload: {
          scaffoldDir: this.props.scaffoldDir,
          dir: node && node.fullName
        },
        callback: data => {
          if (!node) {
            this.setState({ files: data });
          }

          resolve(data);
        }
      });
    });
  };

  addExtraTemplate = (value, node) => {
    let filePath = node.fullName;
    let extra = this.state.extra;
    let paths = filePath.split('\\');
    let file = paths.pop();

    let extraItem = {
      key: uuid(),
      label: file + '模版',
      name: file,
      dir: paths.join('/'),
      desc: '',
      template: filePath
    };

    if (extra.filter(item => item.dir === extraItem.dir && item.name === extraItem.name).length) {
      message.warning(`${file}模版已存在`);
      return;
    }
    extra.unshift(extraItem);
    this.setState({
      extra: extra
    });
    this.triggerChange(extra);

    this.props.dispatch({
      type: 'scaffold/fileContent',
      payload: {
        scaffoldDir: this.props.scaffoldDir,
        file: filePath
      },
      callback: data => {
        let extra = this.state.extra;
        let extraItemNew = extra.find(item => item.key === extraItem.key);
        if (extraItemNew) {
          extraItemNew.template = data;
        }
        this.setState({
          extra: extra
        });
      }
    });
  };
  del = currExtra => {
    let extra = this.state.extra;
    let newExtra = extra.filter(item => item.key !== currExtra.key);
    this.setState({
      extra: newExtra
    });

    this.triggerChange(newExtra);
  };
  toEn = (value, name, record) => {
    const extra = this.state.extra;

    zh2En(value).then(enValue => {
      extra.forEach(item => {
        if (item.key === record.key) {
          item[name] = enValue;
        }
      });
      this.setState({
        extra: extra
      });
      this.triggerChange(extra);
    });
  };

  change = (value, name, record) => {
    const extra = this.state.extra;
    extra.forEach(item => {
      if (item.key === record.key) {
        item[name] = value;
      }
    });

    this.setState({
      extra: extra
    });

    this.triggerChange(extra);
  };

  triggerChange = changedValue => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  renderExtraTemplate = extra => {
    return extra.map((item, index) => {
      return (
        <Row key={item.key}>
          <Col span={3}>
            <Popconfirm title="确认删除吗？" onConfirm={() => this.del(item)}>
              <Icon type="minus-circle" style={{ color: 'red' }} />
            </Popconfirm>

            {item.label}
          </Col>
          <Col span={21}>
            <Row gutter={8}>
              <Col className="gutter-row" span={8}>
                <Input
                  value={item.label}
                  onChange={e => {
                    this.change(e.target.value, 'label', item);
                  }}
                  placeholder="请输入中文名称"
                />
              </Col>
              <Col className="gutter-row" span={8}>
                <Input
                  value={item.name}
                  onChange={e => {
                    this.change(e.target.value, 'name', item);
                  }}
                  placeholder="请输入英文名称"
                />
              </Col>
              <Col className="gutter-row" span={8}>
                <Input
                  value={item.dir}
                  onChange={e => {
                    this.change(e.target.value, 'name', item);
                  }}
                  placeholder="请输入目录"
                />
              </Col>
              <Col className="gutter-row" span={24}>
                <TextArea
                  value={item.desc}
                  onChange={e => {
                    this.change(e.target.value, 'desc', item);
                  }}
                  placeholder="请输入模版介绍"
                />
              </Col>

              <Col className="gutter-row" span={24}>
                <CodeArea
                  value={item.template}
                  onChange={value => {
                    this.change(value, 'template', item);
                  }}
                  height="200px"
                  placeholder="请输入模版内容"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      );
    });
  };

  render() {
    const extra = this.state.extra;

    extra.forEach(item => {
      item.key = item.key || uuid();
    });
    return (
      <span>
        <Row gutter={8}>
          <Col className="gutter-row" span={20}>
            <FileTree
              treeData={this.state.files}
              onSelect={(value, node, extra) => {
                this.addExtraTemplate(value, node, extra);
              }}
              onLoadData={this.getSubFiles}
            />
          </Col>
        </Row>
        {this.renderExtraTemplate(extra)}
      </span>
    );
  }
}
