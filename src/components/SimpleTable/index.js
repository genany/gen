import React from 'react';

import { Table, Form } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global
}))
export default class SimpleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {}

  render() {
    let columns = this.props.columns;
    let expandColumns = [];
    let size = '';
    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    };

    if (this.props.global.isMobile) {
      columns = this.props.columns.filter(item => item.isExpand !== true);
      expandColumns = this.props.columns.filter(item => item.isExpand === true);
    }
    return (
      <Table
        {...this.props}
        columns={columns}
        size={size}
        expandedRowRender={
          expandColumns.length === 0
            ? null
            : record => (
                <Form layout="inline">
                  {expandColumns.map((item, index) => (
                    <FormItem
                      key={record.id + '_' + index}
                      label={item.title}
                      {...formItemLayout}
                    >
                      <span className="ant-form-text">
                        {item.render
                          ? item.render(record[item.dataIndex], record)
                          : record[item.dataIndex]}
                      </span>
                    </FormItem>
                  ))}
                </Form>
              )
        }
      />
    );
  }
}
