import moment from 'moment';
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

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
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

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
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

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}


function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
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
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
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
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function arrToTree(arr, id, pid, rootId, childrenFieldName){
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
    if(parentNode){
      parentNode[childrenFieldName] = parentNode[childrenFieldName] || [];
      parentNode[childrenFieldName].push(item);
    }
  });

  if(map[rootId]){
    tree.push(map[rootId]);
  }else{
    arr.forEach((item, index) => {
      if(item[pid] == rootId){
        tree.push(item);
      }
    });
  }

  buildLevel(tree, 0);

  return tree;


  function buildLevel(tree, level){
    var keys = Object.keys(tree);
    keys.forEach((key, index) => {
      var item = tree[key];
      item.level = level;
      if(item.children){
        buildLevel(item.children, level + 1);
      }
    });
  }
}

export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export function setToEn(value, name){
  zh2En(value).then((data) => {
    this.props.form.setFieldsValue({
      [name]: data
    });
  });
}

export function zh2En(query){
  // var appid = '20180310000133764';
  // var key = 'fFLuE4cLou2nkOU5HGsE';

  var appid = '2015063000000001';
  var key = '12345678';
  var salt = (new Date).getTime();
  var query = query;
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  var from = 'zh';
  var to = 'en';
  var str1 = appid + query + salt +key;
  var sign = MD5(str1);
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
    for(key in params){
      paramsArr.push(key + '=' + window.encodeURIComponent(params[key]));
    }



    jsonp(url, {
      prefix: 'sdemo',
      // name: 'toEN',
      param: paramsArr.join('&'),
    }, function (err, data) {
      if(!data.error_code){
        let enValue = data.trans_result[0].dst;
        let enValueSnakeCase = snakeCase(enValue);
        resolve(enValueSnakeCase);

      }
    });

  });

}

