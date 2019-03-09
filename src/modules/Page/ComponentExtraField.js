import React from 'react';
import { Select, Card } from 'antd';
import { connect } from 'dva';
import Attr from '../../components/Attr';
import { uuid } from '../../utils/utils';
import _ from 'lodash';

const { Option } = Select;

@connect(({ component }) => ({
  component
}))
export default class ComponentExtraField extends React.Component {
  state = {
    extra_field_value: undefined,
    // component: {},
    extraFields: [],
    originComponent: {
      __componentName: '',
      __componentParams: '',
      extra_field: []
    }
  };
  componentDidMount() {
    this.props.dispatch({ type: 'component/list', payload: {} });
  }
  componentWillReceiveProps(nextProps) {
    if ('currComponent' in nextProps && nextProps.currComponent !== this.state.component) {
      let component = nextProps.currComponent;

      if (component && component.__componentName) {
        const originComponent = this.props.component.data.list.find(
          item => item.name === component.__componentName
        );
        originComponent.__componentName = component.__componentName;
        originComponent.__componentParams = component.__componentParams;
        const extraFields = [];
        Object.keys(component).forEach(key => {
          if (key.indexOf('__') !== 0) {
            const extraField = originComponent.extra_field.find(item => item.name === key) || {
              name: key
            };
            extraFields.push({
              ...extraField,
              value: component[key]
            });
          }
        });
        this.setState({
          extraFields,
          originComponent,
          component: component
        });

        // this.setState({ originComponent })
      }
    }
  }
  addExtraField = extraFieldKey => {
    let component = this.state.originComponent;
    let currExtraField = component.extra_field.find(item => item.key == extraFieldKey);
    if (currExtraField) {
      this.setState(
        {
          extraFields: [...this.state.extraFields, currExtraField]
        },
        () => {
          this.onChangeComponent();
        }
      );
    } else {
      console.error(component, extraFieldKey, '不存在怎么可能');
    }
  };

  changeExtraField = extraFields => {
    // let component = this.state.component
    // component.extra_field = extraFields
    // let component = {
    //   __componentName: this.state.component.__componentName,
    //   __componentParams: this.state.component.__componentParams,
    // }
    // extraFields.forEach(item => {
    //   component[item.name] = item.value || item.default_value
    // })

    this.setState({ extraFields }, () => {
      this.onChangeComponent();
    });
  };
  onChangeComponent = () => {
    let component = {
      __componentName: this.state.originComponent.__componentName,
      __componentParams: this.state.originComponent.__componentParams
    };
    this.state.extraFields.forEach(item => {
      component[item.name] = item.value || item.default_value;
    });
    this.props.onChange(component);
  };
  render() {
    // const component = this.state.component
    const originComponent = this.state.originComponent;
    const extraFields = this.state.extraFields;
    const originExtraField = originComponent.extra_field;
    originExtraField.forEach(item => (item.key = item.key || uuid()));
    originExtraField.forEach(item => {
      if (item.required == 1 && !extraFields.find(item2 => item.name === item2.name)) {
        extraFields.push(item);
      }
    });
    const filterExtraField = originExtraField.filter(item => {
      return !extraFields.filter(item2 => item.name == item2.name).length;
    });

    const componentName = originComponent.__componentName || '';

    return (
      <Card title={componentName + '扩展字段'} style={{ marginTop: 6 }}>
        <Select
          value={this.state.extra_field_value}
          placeholder="添加扩展字段"
          onChange={value => this.addExtraField(value)}
          style={{ width: '100%' }}
        >
          {filterExtraField.map(item => {
            return (
              <Option value={item.key} key={item.key}>
                {item.label || item.name}
              </Option>
            );
          })}
        </Select>
        {originComponent && extraFields.length ? (
          <Attr
            value={extraFields}
            onChange={value => this.changeExtraField(value)}
            placeholder="配置扩展字段"
          />
        ) : (
          ''
        )}
      </Card>
    );
  }
}
