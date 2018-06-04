import {
  Form,
  Checkbox,
  Radio,
  DatePicker,
  Input,
  Select,
  Button,
  Tooltip,
  Icon,
  Row,
  Col,
  Card,
  message
} from 'antd';
import JSON5  from 'json5';
import _ from 'lodash';
import CodeArea from '../../components/CodeArea';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

import { uuid } from '../../utils/utils.js';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 3 },
  },
};

const formItemLayoutFull = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
    md: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
    md: { span: 21 },
  },
};

@Form.create()
export default class Attr extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || [];
    this.state = {
      extraField: value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({extraField: value});

    }
  }
  componentDidMount(){

  }

  addExtraField = () => {
    let extraField = this.state.extraField;
    let extraFieldItem = {
      name: '',
      label: '',
      desc: '',
      type: '',
      options: [],
      default_value: '',
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
  }
  del = (item, index) => {
    const extraField = this.state.extraField;
    // extraField.forEach(item => {
    //   if(item.key == record.key){
    //     item[name] = value;
    //   }
    // });
    const newExtraField = extraField.filter(itemData => itemData.key != item.key);

    this.setState({
      extraField: newExtraField
    });

    this.triggerChange(newExtraField);

  }
  change = (value, name, record) => {
    const extraField = this.state.extraField;
    extraField.forEach(item => {
      if(item.key == record.key){
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
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  normalizeFieldOptions = (options) => {
    let optionsStr = options || '[]';
    let newOptions = null;
    try{
      newOptions = JSON5.parse(optionsStr);
    }catch(e){
      console.error(e);
      newOptions = [];
    }

    return newOptions.map(item => {
      if(_.isPlainObject(item)){
        return {
          label: new String(item.label).toString(),
          value: new String(item.value).toString(),
        }
      }else{
        return {
          label: new String(item).toString(),
          value: new String(item).toString(),
        }
      }
    });

  }

  normalizeFieldValue = (value, defaultValue, valueType, type) => {
    let newValue;
    value = value || defaultValue;
    //理论上valueType是什么类型   defaultValue应该就是什么类型，因为添加扩展字段已验证
    if(valueType == 'object'){
      try{
        newValue = JSON5.parse(value);
      }catch(e){
        console.error(e);
        newValue = {};
      }
    }else if(valueType == 'array'){
      try{
        newValue = JSON5.parse(value);
      }catch(e){
        console.error(e);
        newValue = [value];
      }
    }else if(valueType == 'function'){
      newValue = value;
    }else if(valueType == 'reactnode'){
      newValue = value;
    }else if(valueType == 'interface'){
      newValue = value;
    }else{
      try{
        // newValue = JSON5.parse(value);
        newValue = new String(value).toString();
      }catch(e){
        console.error(e);
        newValue = new String(value).toString();
      }
    }

    if(type == 'checkbox' && !_.isArray(newValue)){
      newValue = [newValue];
    }

    return newValue;
  }

  renderExtraFieldControl = (field) =>{
    let type = field.type;
    let options = this.normalizeFieldOptions(field.options);
    let defaultValue = this.normalizeFieldValue(field.value, field.default_value, field.value_type, field.type);
    let valueType = field.vlaue_type;
    let fieldControl = null;

    if(!field.value){
      // this.change(defaultValue, 'value', field);//渲染不能修改state否则无限循环卡死
    }

    switch(type){
      case 'input':
        fieldControl = (<Input value={defaultValue} onChange={e => {this.change(e.target.value, 'value', field)}} placeholder="请输入" style={{width: '100%'}} />);
        break;
      case 'textarea':
        fieldControl = (<TextArea rows="2" value={defaultValue} onChange={e => {this.change(e.target.value, 'value', field)}} placeholder="请输入" style={{width: '100%'}}/>);
        break;
      case 'checkbox':
        fieldControl = (<CheckboxGroup options={options} defaultValue={defaultValue} onChange={e => {this.change(e.target.value, 'value', field)}} />);
        break;
      case 'radio':
        fieldControl = (<RadioGroup options={options} defaultValue={defaultValue} onChange={e => {this.change(e.target.value, 'value', field)}}  />);
        break;
      case 'select':
        fieldControl = (
            <Select defaultValue={defaultValue} onChange={value => {this.change(value, 'value', field)}} style={{width: '100%'}}>
              {options.map((item, index) => {
                return (
                  <Option key={index} value={item.value}>{item.label}</Option>
                );
              })}
            </Select>
          );
        break;
      case 'date':
        fieldControl = (
          <DatePicker defaultValue={defaultValue} onChange={value => {this.change(value, 'value', field)}} />
        );
        break;
      default:
        fieldControl = (<Input style={{width: '100%'}} value={defaultValue} onChange={e => {this.change(e.target.value, 'value', field)}} placeholder="请输入"/>);

    }

    return fieldControl;
  }

  renderExtraField = (extraField) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return extraField.map((item, index) => {
      return (
          <Row key={item.id} gutter={8} style={{marginTop: 10}}>
            <Col className="gutter-row" span={10} style={{textAlign: 'right'}}>
              {item.name}
            </Col>
            <Col className="gutter-row" span={12}>
              {this.renderExtraFieldControl(item)}
            </Col>
            <Col className="gutter-row" span={2}>
              {
                !item.required &&
                  <Icon onClick={() => this.del(item, index)} type="minus-circle" style={{color: 'red'}}/>
              }
              <Tooltip title={(
                <div>
                  {item.label} <br/>{item.desc}
                </div>
              )}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </Col>
          </Row>
      );
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const extraField = this.state.extraField;
    extraField.forEach(item => {
      item.key = item.key || uuid();
    });

    return (
      <span>
        {this.renderExtraField(extraField)}
      </span>
    );
  }
}
