import React from 'react';
import {
  Popconfirm,
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
import JSON5 from 'json5';
import _ from 'lodash';
import { uuid } from '../../utils/utils.js';
import { zh2En } from '../../utils/utils.js';
import CodeArea from '../CodeArea';

const Option = Select.Option;
const { TextArea } = Input;

export default class ExtraField extends React.Component {
  constructor(props) {
    super(props);

    const value = [...this.props.value] || [];
    this.state = {
      visible: false,
      optionValue: '',
      currExtraField: null,
      extraField: value
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = [...nextProps.value];
      this.setState({ extraField: value });
    }
  }
  componentDidMount() {}
  componentWillUnmount() {}

  addExtraField = () => {
    let extraField = this.state.extraField;
    let extraFieldItem = {
      key: uuid(),
      name: '',
      label: '',
      desc: '',
      type: '',
      value_type: [],
      options: '[]',
      default_value: '',
      value: '',
      required: '0'
    };

    extraField.push(extraFieldItem);
    this.setState({
      extraField: extraField
    });

    this.triggerChange(extraField);
  };
  del = currExtraField => {
    let extraField = this.state.extraField;
    let newExtraField = extraField.filter(
      item => item.key !== currExtraField.key
    );
    this.setState({
      extraField: newExtraField
    });

    this.triggerChange(newExtraField);
  };
  toEn = (value, name, record) => {
    const extraField = this.state.extraField;

    zh2En(value).then(enValue => {
      extraField.forEach(item => {
        if (item.key === record.key) {
          item[name] = enValue;
        }
      });
      this.setState({
        extraField: extraField
      });
      this.triggerChange(extraField);
    });
  };

  change = (value, name, record) => {
    const extraField = this.state.extraField;
    extraField.forEach(item => {
      if (item.key === record.key) {
        item[name] = value;
        if (name === 'value_type') {
          // 切换值类型清空 值选项和默认值
          item.options = '[]';
          item.default_value = '';
        }
      }
    });

    this.setState({
      extraField: extraField
    });

    this.triggerChange(extraField);

    // this.props.dispatch({
    //   type: 'template/updateExtraField',
    //   payload: extraField
    // });
  };

  validDefaultValue = (value, item) => {
    let validValue = this.getValidValue(value, item.value_type, item.type);
    if (!validValue.isValid) {
      message.warning(validValue.msg);
    }
  };

  triggerChange = changedValue => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  showModal = currExtraField => {
    if (!currExtraField.value_type) {
      message.warning('请选择值类型');
      return;
    }
    this.setState({ visible: true, currExtraField });
  };

  changeOptionValue = optionValue => {
    console.log(optionValue);
    this.setState({
      optionValue
    });
  };

  handleOptionValueOk = () => {
    let currExtraField = this.state.currExtraField;
    let options = JSON5.parse(currExtraField.options || '[]');
    let optionValue = this.state.optionValue;

    let validValue = this.getValidValue(optionValue, currExtraField.value_type);
    if (!validValue.isValid) {
      message.warning(validValue.msg);
      return;
    }

    options.push(validValue.value);

    this.change(JSON5.stringify(options), 'options', currExtraField);
    this.setState({
      visible: false,
      optionValue: ''
    });
  };

  getValidValue = (value, valueType, controlType) => {
    let valueMap = {
      value: value,
      isValid: true,
      msg: '有效'
    };

    if (valueType === 'string') {
    } else if (valueType === 'number') {
      var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
      if (!regPos.test(value) && !regNeg.test(value)) {
        valueMap.isValid = false;
        valueMap.msg = '请输入合法number';
      } else {
        value = _.toNumber(value);
      }
    } else if (valueType === 'array') {
      try {
        let valueArray = JSON5.parse(value);
        if (!_.isArray(valueArray)) {
          valueMap.isValid = false;
          valueMap.msg = '请输入合法array';
        } else {
          value = valueArray;
        }
      } catch (e) {
        valueMap.isValid = false;
        valueMap.msg = '请输入合法array';
      }
    } else if (valueType === 'object') {
      try {
        let valueObject = JSON5.parse(value);
        if (!_.isPlainObject(valueObject)) {
          valueMap.isValid = false;
          valueMap.msg = '请输入合法object';
        } else {
          value = valueObject;
        }
      } catch (e) {
        valueMap.isValid = false;
        valueMap.msg = '请输入合法object';
      }
    } else if (valueType === 'boolean') {
      if (value !== 'true' && value !== 'false') {
        valueMap.isValid = false;
        valueMap.msg = '只能输入true或false';
      } else {
        value = JSON5.parse(value);
      }
    } else if (valueType === 'integer') {
      if (!/[-]?\d+/.test(value)) {
        valueMap.isValid = false;
        valueMap.msg = '请输入合法integer';
      } else {
        value = _.toInteger(value);
      }
    } else if (valueType === 'function') {
    } else if (valueType === 'reactnode') {
    } else if (valueType === 'any') {
    } else if (valueType === 'interface') {
    }

    valueMap.value = value;
    return valueMap;
  };

  handleOptionValueCancel = () => {
    this.setState({
      visible: false,
      optionValue: ''
    });
  };

  renderExtraField = extraField => {
    return extraField.map((item, index) => {
      return (
        <Row key={item.key} gutter={8}>
          <Col span={3}>
            <div>{'扩展字段' + (index + 1)}</div>
            <Popconfirm title="确认删除吗？" onConfirm={() => this.del(item)}>
              <Icon type="minus-circle" style={{ color: 'red' }} />
            </Popconfirm>
            <Icon
              onClick={this.addExtraField}
              type="plus-circle-o"
              style={{ marginLeft: 12 }}
            />
          </Col>
          <Col className="gutter-row" span={21}>
            <Row gutter={8}>
              <Col className="gutter-row" span={8}>
                <Input
                  value={item.label}
                  onBlur={e => {
                    this.toEn(e.target.value, 'name', item);
                  }}
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
                <TextArea
                  value={item.desc}
                  onChange={e => {
                    this.change(e.target.value, 'desc', item);
                  }}
                  placeholder="请输入简介"
                />
              </Col>
              <Col className="gutter-row" span={8}>
                <Select
                  value={item.required}
                  onChange={e => {
                    this.change(e, 'required', item);
                  }}
                  placeholder="请是否必须配置"
                >
                  <Option value="1">必须配置</Option>
                  <Option value="0">可选配置</Option>
                </Select>
              </Col>
              <Col className="gutter-row" span={8}>
                <Select
                  value={item.type}
                  onChange={e => {
                    this.change(e, 'type', item);
                  }}
                  placeholder="请选择值类型"
                >
                  <Option value="">请选择"值控件"类型</Option>
                  <Option value="radio">单选</Option>
                  <Option value="checkbox">多选</Option>
                  <Option value="input">单行输入</Option>
                  <Option value="textarea">多行输入</Option>
                  <Option value="select">下拉选择</Option>
                  <Option value="date">日期</Option>
                </Select>
              </Col>
              <Col className="gutter-row" span={8}>
                <Select
                  value={item.value_type}
                  onChange={e => {
                    this.change(e, 'value_type', item);
                  }}
                  placeholder="请选择值类型"
                >
                  <Option value="">请选择"值"类型</Option>
                  <Option value="string">string</Option>
                  <Option value="number">number</Option>
                  <Option value="boolean">boolean</Option>
                  <Option value="integer">integer</Option>
                  <Option value="object">object</Option>
                  {
                    // <Option value="emun">emun</Option>
                    // <Option value="stringArray">string[]</Option>
                    // <Option value="numberArray">number[]</Option>
                    // <Option value="integerArray">integer[]</Option>
                    // <Option value="objectArray">object[]</Option>
                  }
                  <Option value="function">function</Option>
                  <Option value="reactnode">ReactNode</Option>
                  <Option value="any">any</Option>
                  <Option value="interface">接口数据</Option>
                </Select>
              </Col>
              <Col className="gutter-row" span={16}>
                <Col span={20}>
                  <CodeArea
                    value={item.options}
                    onChange={value => {
                      this.change(value, 'options', item);
                    }}
                    placeholder="请输入选项， 请点击右侧添加值按钮"
                  />
                </Col>
                <Col span={4}>
                  <Button onClick={() => this.showModal(item)} type="primary">
                    添加值
                  </Button>
                </Col>
              </Col>
              <Col className="gutter-row" span={8}>
                <CodeArea
                  value={item.default_value}
                  onChange={value => {
                    this.change(value, 'default_value', item);
                  }}
                  onBlur={value => {
                    this.validDefaultValue(value, item);
                  }}
                  placeholder="请输入默认值"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      );
    });
  };

  render() {
    const extraField = this.state.extraField;
    extraField.forEach(item => {
      item.key = item.key || uuid();
    });
    return (
      <span>
        <Row gutter={8}>
          <Col className="gutter-row" span={3}>
            扩展字段&nbsp;
            <Tooltip title="这里得扩展字段，在模版中直接使用，在创建页面一定显示，让用户配置。比如组件的属性或方法配置">
              <Icon type="question-circle-o" />
            </Tooltip>
          </Col>
          <Col className="gutter-row" span={21}>
            <Button onClick={this.addExtraField}>添加扩展字段</Button>
          </Col>
        </Row>
        {this.renderExtraField(extraField)}
        <Modal
          title="添加可选值"
          visible={this.state.visible}
          onOk={this.handleOptionValueOk}
          onCancel={this.handleOptionValueCancel}
        >
          <CodeArea
            value={this.state.optionValue}
            onChange={value => {
              this.changeOptionValue(value);
            }}
            placeholder="请输入选项值"
          />
        </Modal>
      </span>
    );
  }
}
