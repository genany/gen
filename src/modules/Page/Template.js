import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message, notification, Select } from 'antd';
import _ from 'lodash';

@connect(({ template, loading }) => ({
  template
}))
export default class Template extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      templateName: undefined
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.templateName) {
      let templateName = nextProps.value;
      console.log('TCL: Template -> componentWillReceiveProps -> templateName', templateName);
      this.setState({ templateName });
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'template/list',
      payload: {}
    });
  }

  onChange = templateName => {
    console.log('TCL: Template -> templateName', templateName);
    if (!templateName) {
      message.warning('请选择页面模版');
      return;
    }

    let template = this.props.template.data.list.find(item => item.name === templateName);

    this.setState({
      templateName: templateName
    });
    if (this.props.onChange) {
      this.props.onChange(template);
    }
  };
  changePageTemplateTips = templateName => {
    if (!templateName) {
      return;
    }
    notification.warning({
      message: '更换模板数据不能恢复'
    });
  };

  render() {
    const templateData = this.props.template.data;
    const templateName = this.state.templateName;
    return (
      <Select
        onChange={value => this.onChange(value)}
        onFocus={this.changePageTemplateTips}
        value={templateName}
        placeholder={this.props.placeholder}
      >
        {templateData.list.map(item => {
          return (
            <Select.Option value={item.name} key={item.name}>
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}
