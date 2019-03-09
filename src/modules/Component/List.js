import React, { Fragment } from 'react';
import { Form, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import MyList from '../../components/List';

@Form.create()
@connect(({ global, component, loading }) => ({
  global,
  component,
  loading: loading.effects['component/getList']
}))
export default class List extends MyList {
  modeName = 'component';
  dataKey = 'data';
  listUrl = 'component/list';
  addUrl = '/component/add/0';
  delUrl = 'component/remove';
  columns = [
    {
      dataIndex: 'test',
      title: '',
      key: 'template_id'
    },
    // {
    //   dataIndex: 'component.label',
    //   title: '父组件',
    //   key: 'pid',
    //   render: (text, record) => {
    //     let url = '/component/Add/' + record.pid;
    //     return (
    //       <Fragment>
    //         <Link to={url}>{text}</Link>
    //       </Fragment>
    //     );
    //   }
    // },
    {
      dataIndex: 'name',
      title: '英文名称',
      key: 'name'
    },

    {
      dataIndex: 'label',
      title: '中文名称',
      key: 'label'
    },

    {
      dataIndex: 'desc',
      title: '简介',
      key: 'desc'
    },

    // {
    //   dataIndex: 'template',
    //   title: '模板',
    //   key: 'template',
    // },

    {
      title: '操作',
      render: (text, record, index) => {
        return (
          <Fragment>
            <Link to={'/component/add/' + record.id}>查看</Link>
            <Divider type="vertical" />
            <Link to={'/component/add/' + record.id}>编辑</Link>
            <Divider type="vertical" />
            <Popconfirm title="确认删除吗？" onConfirm={() => this.onDelete(record, index)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        );
      }
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'component/list',
      payload: {}
    });
  }
}
