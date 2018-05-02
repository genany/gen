import { stringify } from 'qs';
import request from '../utils/request';

export async function previewApp(params) {
  return request(`/api/preview/app`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function previewPage(params) {
  return request(`/api/preview/page`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}
export async function preview(params) {
  return request(`/api/preview/preview`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}


export async function appList(params) {
  return request(`/api/app/list`, {
    body: {
      ...params,
    }
  });
}

export async function appInfo(params) {
  return request(`/api/app/info`, {
    body: {
      ...params,
    }
  });
}

export async function appRemove(params) {
  return request(`/api/app/remove`, {
    body: {
      ...params,
    }
  });
}

export async function appAdd(params) {
  return request(`/api/app/save`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function pageList(params) {
  return request(`/api/page/list`, {
    body: {
      ...params,
    }
  });
}

export async function pageInfo(params) {
  return request(`/api/page/info`, {
    body: {
      ...params,
    }
  });
}

export async function pageRemove(params) {
  return request(`/api/page/remove`, {
    body: {
      ...params,
    }
  });
}

export async function pageAdd(params) {
  return request(`/api/page/save`, {
    method: 'post',
    // method: 'post',
    body: {
      ...params,
    }
  });
}

export async function scaffoldList(params) {
  return request(`/api/scaffold/list`, {
    body: {
      ...params,
    }
  });
}

export async function scaffoldInfo(params) {
  return request(`/api/scaffold/info`, {
    body: {
      ...params,
    }
  });
}

export async function scaffoldRemove(params) {
  return request(`/api/scaffold/remove`, {
    body: {
      ...params,
    }
  });
}

export async function scaffoldAdd(params) {
  return request(`/api/scaffold/save`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function interAppList(params) {
  return request(`/api/interapp/list`, {
    body: {
      ...params,
    }
  });
}

export async function interAppInfo(params) {
  return request(`/api/interapp/info`, {
    body: {
      ...params,
    }
  });
}

export async function interAppRemove(params) {
  return request(`/api/interapp/remove`, {
    body: {
      ...params,
    }
  });
}

export async function interAppAdd(params) {
  return request(`/api/interapp/save`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function interList(params) {
  return request(`/api/inter/list`, {
    body: {
      ...params,
    }
  });
}

export async function interInfo(params) {
  return request(`/api/inter/info`, {
    body: {
      ...params,
    }
  });
}

export async function interRemove(params) {
  return request(`/api/inter/remove`, {
    body: {
      ...params,
    }
  });
}

export async function interAdd(params) {
  return request(`/api/inter/save`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function layoutList(params) {
  return request(`/api/layout/list`, {
    body: {
      ...params,
    }
  });
}

export async function layoutInfo(params) {
  return request(`/api/layout/info`, {
    body: {
      ...params,
    }
  });
}

export async function layoutRemove(params) {
  return request(`/api/layout/remove`, {
    body: {
      ...params,
    }
  });
}

export async function layoutAdd(params) {
  return request(`/api/layout/save`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function templateList(params) {
  return request(`/api/template/list`, {
    body: {
      ...params,
    }
  });
}

export async function templateInfo(params) {
  return request(`/api/template/info`, {
    body: {
      ...params,
    }
  });
}

export async function templateRemove(params) {
  return request(`/api/template/remove`, {
    body: {
      ...params,
    }
  });
}

export async function templateAdd(params) {
  return request(`/api/template/save`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function componentList(params) {
  return request(`/api/component/list`, {
    body: {
      ...params,
    }
  });
}

export async function componentInfo(params) {
  return request(`/api/component/info`, {
    body: {
      ...params,
    }
  });
}

export async function componentRemove(params) {
  return request(`/api/component/remove`, {
    body: {
      ...params,
    }
  });
}

export async function componentAdd(params) {
  return request(`/api/component/save`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function validList(params) {
  return request(`/api/valid/list`, {
    body: {
      ...params,
    }
  });
}

export async function validInfo(params) {
  return request(`/api/valid/info`, {
    body: {
      ...params,
    }
  });
}

export async function validRemove(params) {
  return request(`/api/valid/remove`, {
    body: {
      ...params,
    }
  });
}

export async function validAdd(params) {
  return request(`/api/valid/save`, {
    method: 'post',
    body: {
      ...params,
    }
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/api/user/register', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryNotices() {
  return request('/api/user/userInfo');
}
