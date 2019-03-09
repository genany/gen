import React from 'react';
import ReactDOM from 'react-dom';
import './assets/common.less';
import App from './App';
import registerServiceWorker, { unregister } from './registerServiceWorker';
import { hot } from 'react-hot-loader';

import dva from 'dva';
import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import { createLogger } from 'redux-logger';

// 1. Initialize
const app = dva({
  history: createHistory(),
  onAction: createLogger({ level: 'log' })
});

app.use(createLoading());

app.model(require('./models/global').default);
app.model(require('./models/app').default);
app.model(require('./models/chart').default);
app.model(require('./models/template').default);
app.model(require('./models/component').default);
app.model(require('./models/inter').default);
app.model(require('./models/interApp').default);
app.model(require('./models/layout').default);
app.model(require('./models/page').default);
app.model(require('./models/preview').default);
app.model(require('./models/scaffold').default);
app.model(require('./models/user').default);
app.model(require('./models/valid').default);

hot(module)(App);

app.router(App);
app.start('#root');

const store = app._store;

const user = localStorage.getItem('user');
if (user) {
  try {
    store.dispatch({
      type: 'user/userInfo',
      payload: JSON.parse(user)
    });
  } catch (error) {}
}

export default store;

if (window.location.protocol === 'https:') {
  registerServiceWorker();
}

// unregister();
