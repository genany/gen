import React from 'react';
import { Checkbox, Radio, DatePicker, Input, Select, Tooltip, Icon, Row, Col } from 'antd';
import JSON5 from 'json5';
import _ from 'lodash';
import { uuid } from '../../utils/utils.js';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class Attr extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || [];
    this.state = {
      extraField: value
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ extraField: value });
    }
  }
  componentDidMount() {}

  addExtraField = () => {
    let extraField = this.state.extraField;
    let extraFieldItem = {
      name: '',
      label: '',
      desc: '',
      type: '',
      options: [],
      default_value: ''
    };

    extraField.push(extraFieldItem);
    this.setState({
      extraField: extraField
    });

    this.triggerChange(extraField);

    // this.props.dispatch({
    //   type: 'template/addExtraField',
    //   payload: extraField,
    // });
  };
  del = (item, index) => {
    const extraField = this.state.extraField;
    // extraField.forEach(item => {
    //   if(item.key == record.key){
    //     item[name] = value;
    //   }
    // });
    const newExtraField = extraField.filter(itemData => itemData.name !== item.name);

    this.setState({
      extraField: newExtraField
    });

    this.triggerChange(newExtraField);
  };
  change = (value, name, record) => {
    const extraField = this.state.extraField;
    extraField.forEach(item => {
      if (item.name === record.name) {
        item[name] = value;
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

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  normalizeFieldOptions = options => {
    let optionsStr = options || '[]';
    let newOptions = null;
    try {
      newOptions = JSON5.parse(optionsStr);
    } catch (e) {
      console.error(e);
      newOptions = [];
    }

    return newOptions.map(item => {
      if (_.isPlainObject(item)) {
        return {
          label: new String(item.label).toString(),
          value: new String(item.value).toString()
        };
      } else {
        return {
          label: new String(item).toString(),
          value: new String(item).toString()
        };
      }
    });
  };

  normalizeFieldValue = (value, defaultValue, valueType, type) => {
    let newValue;
    value = value || defaultValue;
    // 理论上valueType是什么类型   defaultValue应该就是什么类型，因为添加扩展字段已验证
    if (valueType === 'object') {
      try {
        newValue = JSON5.parse(value);
      } catch (e) {
        console.error(e);
        newValue = {};
      }
    } else if (valueType === 'array') {
      try {
        newValue = JSON5.parse(value);
      } catch (e) {
        console.error(e);
        newValue = [value];
      }
    } else if (valueType === 'function') {
      newValue = value;
    } else if (valueType === 'reactnode') {
      newValue = value;
    } else if (valueType === 'interface') {
      newValue = value;
    } else {
      try {
        // newValue = JSON5.parse(value);
        newValue = new String(value).toString();
      } catch (e) {
        console.error(e);
        newValue = new String(value).toString();
      }
    }

    if (type === 'checkbox' && !_.isArray(newValue)) {
      newValue = [newValue];
    }

    return newValue;
  };

  renderExtraFieldControl = field => {
    let type = field.type;
    let options = this.normalizeFieldOptions(field.options);
    let defaultValue = this.normalizeFieldValue(
      field.value,
      field.default_value,
      field.value_type,
      field.type
    );
    let valueType = field.value_type;
    let fieldControl = null;

    if (!field.value) {
      // this.change(defaultValue, 'value', field);//渲染不能修改state否则无限循环卡死
    }

    switch (type) {
      case 'input':
        fieldControl = (
          <Input
            value={defaultValue}
            onChange={e => {
              this.change(e.target.value, 'value', field);
            }}
            placeholder="请输入"
            style={{ width: '100%' }}
          />
        );
        break;
      case 'textarea':
        fieldControl = (
          <TextArea
            rows="2"
            value={defaultValue}
            onChange={e => {
              this.change(e.target.value, 'value', field);
            }}
            placeholder="请输入"
            style={{ width: '100%' }}
          />
        );
        break;
      case 'checkbox':
        fieldControl = (
          <CheckboxGroup
            options={options}
            defaultValue={defaultValue}
            onChange={e => {
              this.change(e.target.value, 'value', field);
            }}
          />
        );
        break;
      case 'radio':
        fieldControl = (
          <RadioGroup
            options={options}
            defaultValue={defaultValue}
            onChange={e => {
              this.change(e.target.value, 'value', field);
            }}
          />
        );
        break;
      case 'select':
        fieldControl = (
          <Select
            defaultValue={defaultValue}
            onChange={value => {
              this.change(value, 'value', field);
            }}
            style={{ width: '100%' }}
          >
            {options.map((item, index) => {
              return (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        );
        break;
      case 'date':
        fieldControl = (
          <DatePicker
            defaultValue={defaultValue}
            onChange={value => {
              this.change(value, 'value', field);
            }}
          />
        );
        break;
      default:
        fieldControl = (
          <Input
            style={{ width: '100%' }}
            value={defaultValue}
            onChange={e => {
              this.change(e.target.value, 'value', field);
            }}
            placeholder="请输入"
          />
        );
    }

    return fieldControl;
  };

  renderExtraField = extraField => {
    return extraField.map((item, index) => {
      return (
        <Row key={item.name} gutter={8} style={{ marginTop: 10 }}>
          <Col className="gutter-row" span={20} style={{ fontWeight: 'bold', marginBottom: '6px' }}>
            <Tooltip
              title={
                <div>
                  {item.label} <br />
                  {item.desc}
                </div>
              }
            >
              {item.name} <Icon type="question-circle-o" />
            </Tooltip>
          </Col>
          <Col className="gutter-row" span={4}>
            {!item.required && (
              <Icon
                onClick={() => this.del(item, index)}
                type="minus-circle"
                style={{ color: 'red' }}
              />
            )}
          </Col>
          <Col className="gutter-row" span={24}>
            {this.renderExtraFieldControl(item)}
          </Col>
        </Row>
      );
    });
  };

  render() {
    const extraField = this.state.extraField;

    return <span>{this.renderExtraField(extraField)}</span>;
  }
}
