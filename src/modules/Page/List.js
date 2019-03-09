import React, { Fragment } from 'react';
import { Form, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import native from '../../utils/native';
import MyList from '../../components/List';

@Form.create()
@connect(({ global, page, loading }) => ({
  global,
  page,
  loading: loading.effects['page/getList']
}))
export default class List extends MyList {
  modeName = 'page';
  dataKey = 'data';
  listUrl = 'page/list';
  addUrl = '/page/add/0/0/0/0';
  delUrl = 'page/remove';
  columns = [
    {
      dataIndex: 'app.label',
      title: '所属APP',
      key: 'app_id',
      render: (text, record) => {
        let url = '/app/Add/' + record.app_id;
        return (
          <Fragment>
            <Link to={url}>{text}</Link>
          </Fragment>
        );
      }
    },
    {
      dataIndex: 'label',
      title: '名称',
      key: 'label'
    },
    {
      dataIndex: 'path',
      title: '路径',
      key: 'path'
    },
    // {
    //   dataIndex: 'interface',
    //   title: '接口',
    // },
    // {
    //   dataIndex: 'template',
    //   title: '模版',
    // },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => {
        let app_id = record.app_id;
        let id = record.id;
        let pid = record.pid || 0;
        let params = '/' + app_id + '/' + id + '/' + pid + '/0';

        let previewUrl = this.getPreviewUrl(record);

        return (
          <Fragment>
            <a href={previewUrl} target="_blank">
              预览
            </a>
            <Divider type="vertical" />
            <Link to={'/page/add' + params}>编辑</Link>
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
      type: 'page/list'
    });
    dispatch({
      type: 'scaffold/list'
    });
  }

  getPreviewUrl(item) {
    // let scaffold = this.props.scaffold.data.list.find(item => item.id == item.app.scaffold_id);
    // let previewUrl = '';
    // if(scaffold){
    //   // previewUrl = window.location.protocol + '//' + window.location.host + '/scaffold/' + scaffold.name + '/' + item.path;
    //   previewUrl = 'http://scaffold.sdemo.cn/#' + item.path;
    // }
    // return previewUrl;
    return native.getPreviewPageUrl(item.app_id, item.path);
  }
}
