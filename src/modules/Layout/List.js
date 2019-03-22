import React, { Fragment } from 'react';
import { Form, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import MyList from '../../components/List';

@Form.create()
@connect(({ global, layout, loading }) => ({
  global,
  layout,
  loading: loading.effects['layout/list']
}))
export default class List extends MyList {
  modeName = 'layout';
  dataKey = 'data';
  listUrl = 'layout/list';
  addUrl = '/layout/add/0';
  delUrl = 'layout/remove';
  columns = [
    {
      dataIndex: 'label',
      title: '名称',
      key: 'label'
    },
    {
      dataIndex: 'scaffold.label',
      title: '脚手架',
      key: 'scaffold',
      render: (text, record) => {
        let url = '/scaffold/Add/' + record.scaffold_id;
        return (
          <Fragment>
            <Link to={url}>{text}</Link>
          </Fragment>
        );
      }
    },
    {
      dataIndex: 'desc',
      title: '简介',
      key: 'desc'
    },
    {
      dataIndex: 'template',
      title: '模版',
      key: 'template'
    },
    // {
    //   dataIndex: 'htmlTemplate',
    //   title: 'html模版',
    // key: 'htmlTemplate',
    // },
    // {
    //   dataIndex: 'jsTemplate',
    //   title: 'js模版',
    // key: 'jsTemplate',
    // },
    // {
    //   dataIndex: 'cssTemplate',
    //   title: 'css模版',
    // key: 'cssTemplate',
    // },

    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => {
        return (
          <Fragment>
            <Link to={'/layout/add/' + record.id}>预览</Link>
            <Divider type="vertical" />
            <Link to={'/layout/add/' + record.id}>查看</Link>
            <Divider type="vertical" />
            <Link to={'/layout/add/' + record.id}>编辑</Link>
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
      type: 'layout/list'
    });
  }
}
