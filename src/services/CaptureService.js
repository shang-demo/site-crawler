const { calculateTime } = require('./UtilService');

/* eslint-disable newline-per-chained-call */
/* eslint-disable no-mixed-operators */
function captureZD($) {
  let list = [];
  let now = new Date();
  $('.wrapper .content-wrap .excerpt li').each((i, e) => {
    let item = $(e).children('h2').last();
    let title = item.text();
    let link = item.children('a').last().attr('href');
    let img = $(e).children('a').first().children('img').first().attr('src');
    let time = `${now.getFullYear()}-${$(e).children('.info').last().children('.time').last().text()}`;
    let note = $(e).children('.note').last().text();

    if (!title || !link) {
      return;
    }

    list.push({
      img,
      title,
      href: link,
      time: new Date(time).getTime() + 1000 - i,
      gatherTime: now.getTime() + 1000 - i,
      intro: note
    });
  });
  return list;
}

function captureIQQ($) {
  let list = [];
  let now = new Date();
  $('.tab_box .news-comm-wrap').first().find('.news-comm li').each((i, e) => {
    let img = 'http://www.iqshw.com/templets/iqshw_new/logo.jpg';
    let oA = $(e).children('a').last();
    let href = oA.attr('href');
    let title = oA.text();
    let time = `${now.getFullYear()}-${$(e).children('span').last().text()}`;
    list.push({
      img,
      title,
      href: `http://www.iqshw.com${href}`,
      time: new Date(time).getTime() + 1000 - i,
      gatherTime: now.getTime() + 1000 - i,
      intro: title
    });
  });
  return list;
}

function captureLLM($) {
  let list = [];
  let now = new Date();
  $('.content .excerpt').each((i, e) => {
    let aItem = $(e).find('h2').first().find('a').first();
    let timeStr = $(e).find('.icon-time').parent().first().text();
    let timeNu = calculateTime(timeStr);
    list.push({
      img: $(e).find('.focus').first().find('img').first().attr('src'),
      title: aItem.attr('title'),
      href: aItem.attr('href'),
      time: timeNu + 1000 - i,
      gatherTime: now.getTime() + 1000 - i,
      intro: $(e).find('.note').text()
    });
  });
  return list;
}

function captureXclient($) {
  let list = [];
  let now = new Date();
  $('#main')
    .find('.post_list li')
    .each((i, e) => {
      let img = $(e).find('.lim-icon').first().attr('src');
      let listItemMeta = $(e).find('.info').first();
      let title = listItemMeta.find('h3').first().text();
      let href = $(e).find('a').first().attr('href');
      let time = $(e).find('.date').first().text().replace(/\./gi, '/');
      let timeNu = UtilService.calculateTime(time);
      let intro = listItemMeta.find('p').first().text();
      list.push({
        img,
        title,
        href,
        time: timeNu + 1000 - i,
        gatherTime: now.getTime() + 1000 - i,
        intro
      });
    });
  return list;
}

module.exports.allSites = [{
  isChecked: true,
  name: 'zd',
  site: 'zd',
  description: '专注绿软，分享软件、传递最新软件资讯',
  classify: 'windows',
  requestConfig: {
    url: 'http://www.zdfans.com/'
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureZD
    }]
  }
}, {
  isChecked: true,
  name: 'llm',
  site: 'llm',
  description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
  classify: 'info',
  requestConfig: {
    url: 'https://liulanmi.com/'
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureLLM
    }]
  }
}, {
  name: 'iqq',
  url: 'http://www.iqshw.com/',
  site: 'iqq',
  description: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
  classify: 'info',
  requestConfig: {
    url: 'http://www.iqshw.com/'
  },
  pageFun(i) {
    if (i === 1) {
      return 'http://www.iqshw.com/';
    }

    return 'https://www.baidu.com';
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureIQQ
    }]
  }
}, {
  isChecked: true,
  name: 'xclient',
  site: 'xclient',
  description: '精品MAC应用分享，每天分享大量mac软件，为您提供优质的mac破解软件,免费软件下载服务',
  classify: 'mac',
  pageFun(i) {
    return `http://xclient.info/s/${i}/`;
  },
  requestConfig: {
    url: 'http://xclient.info/s/'
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureXclient
    }]
  }
}];
