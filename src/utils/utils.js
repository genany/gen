import moment from 'moment';
import { parse, stringify } from 'qs';
import MD5 from './md5.js';
import snakeCase from 'lodash.snakecase';
import jsonp from './jsonp.js';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      )
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getDay(time) {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();
  const nextDate = moment(now).add(1, 'months');
  const nextYear = nextDate.year();
  const nextMonth = nextDate.month();

  return [
    moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
    moment(
      moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() -
        1000
    )
  ];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(
      /零./,
      ''
    );
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(
      route => route !== item && getRelation(route, item) === 1
    );
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function dateFormater(time) {
  time = '' + time;
  if (time.length === 10) {
    time = time * 1000;
  }
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

export function toSecond(time) {
  if (moment.isMoment(time)) {
    time = time.valueOf();
  }
  time = '' + time;
  if (time.length === 13) {
    time = Math.ceil(time / 1000);
  }

  return '' + time;
}

export function pageHandle(payload, listInfo) {
  payload = payload || {};
  payload.page = payload.page || 1;
  payload.pageSize = payload.pageSize || 20;
  payload.ts = payload.page === 1 ? Date.parse(new Date()) / 1000 : listInfo.ts;
}

export function commafy(num, char) {
  num = num + '';
  var re = /(-?\d+)(\d{3})/;
  char = char || ',';
  while (re.test(num)) {
    num = num.replace(re, '$1' + char + '$2');
  }
  return num;
}

export function percent(number) {
  number = number + '';
  if (number.indexOf('%') === -1) {
    number = this.commafy(number * 100) + '%';
  }

  return number;
}

export function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}

export function toFixed(num, len) {
  let reg = new RegExp(`^\d+(?:\.\d{0,${len}})?`);
  if (isNaN(num)) {
    return num;
  } else {
    return Number(num.toString().match(reg));
  }
}

export function arrToTree(arr, id, pid, rootId, childrenFieldName) {
  var map = {};
  var tree = [];
  id = id || 'id';
  pid = pid || 'pid';
  rootId = rootId || null;
  childrenFieldName = childrenFieldName || 'children';

  arr.forEach((item, index) => {
    map[item[id]] = item;
  });

  arr.forEach((item, index) => {
    var parentNode = map[item[pid]];
    if (parentNode) {
      parentNode[childrenFieldName] = parentNode[childrenFieldName] || [];
      parentNode[childrenFieldName].push(item);
    }
  });

  if (map[rootId]) {
    tree.push(map[rootId]);
  } else {
    arr.forEach((item, index) => {
      if (item[pid] == rootId) {
        tree.push(item);
      }
    });
  }

  buildLevel(tree, 0);

  return tree;

  function buildLevel(tree, level) {
    var keys = Object.keys(tree);
    keys.forEach((key, index) => {
      var item = tree[key];
      item.level = level;
      if (item.children) {
        buildLevel(item.children, level + 1);
      }
    });
  }
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0;

    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function setToEn(value, name) {
  zh2En(value).then(data => {
    this.props.form.setFieldsValue({
      [name]: data
    });
  });
}

export function zh2En(query) {
  var appid = '20180310000133764';
  var key = 'fFLuE4cLou2nkOU5HGsE';

  // var appid = '2015063000000001';
  // var key = '12345678';
  var salt = new Date().getTime();
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  var from = 'zh';
  var to = 'en';
  var str1 = appid + query + salt + key;
  var sign = MD5(str1);
  console.log('TCL: exportfunctionzh2En -> sign', sign);

  return new Promise((resolve, reject) => {
    let url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
    let params = {
      q: query,
      appid: appid,
      salt: salt,
      from: from,
      to: to,
      sign: sign
    };
    let paramsArr = [];
    for (key in params) {
      paramsArr.push(key + '=' + window.encodeURIComponent(params[key]));
    }

    jsonp(
      url,
      {
        prefix: 'sdemo',
        // name: 'toEN',
        param: paramsArr.join('&')
      },
      function(err, data) {
        if (!data.error_code) {
          let enValue = data.trans_result[0].dst;
          let enValueSnakeCase = snakeCase(enValue);
          resolve(enValueSnakeCase);
        }
      }
    );
  });
}

export function getQueryString(name, url) {
  url = url || window.location.search;
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = url.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}
