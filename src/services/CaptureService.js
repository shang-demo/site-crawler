module.exports.allSites = [
  {
    site: 'zd',
    requestOptions: {
      url: 'http://www.zdfans.com/'
    },
    sitemap: {
      selectors: [
        {
          parentSelectors: ['_root'],
          type: 'SelectorElement',
          multiple: true,
          id: 'item',
          selector: 'div.content li',
          delay: ''
        }, {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'title',
          selector: 'h2 a',
          regex: '',
          delay: ''
        }, {
          parentSelectors: ['item'],
          type: 'SelectorLink',
          multiple: false,
          id: 'href',
          selector: 'h2 a',
          delay: ''
        }, {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'date',
          selector: 'span.time',
          regex: '\\d+\\-\\d+',
          delay: ''
        }, {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'intro',
          selector: 'div.note',
          regex: '',
          delay: ''
        }, {
          parentSelectors: ['item'],
          type: 'SelectorImage',
          multiple: false,
          id: 'img',
          selector: 'img',
          downloadImage: false,
          delay: ''
        }],
      startUrl: 'http://www.zdfans.com/',
      _id: 'zdfans'
    },
    transform: {
      date: {
        fn: 'formatDate',
        param: 'MMDD',
      },
    },
  },
  {
    site: 'llm',
    requestOptions: {
      url: 'https://liulanmi.com/'
    },
    sitemap: {
      startUrl: 'https://liulanmi.com/',
      selectors: [
        {
          parentSelectors: ['_root'],
          type: 'SelectorElement',
          multiple: true,
          id: 'item',
          selector: 'article.excerpt',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'title',
          selector: 'h2 a',
          regex: '',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'date',
          selector: 'p:nth-of-type(1)',
          regex: '\\d.*?前',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorLink',
          multiple: false,
          id: 'href',
          selector: 'h2 a',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'intro',
          selector: 'p.note',
          regex: '',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorImage',
          multiple: false,
          id: 'img',
          selector: 'img',
          downloadImage: false,
          delay: ''
        }],
      _id: 'llm'
    },
    transform: {
      date: {
        fn: 'formatDate',
        param: 'chinese-offset',
      },
    },
  },
  {
    site: 'iqq',
    requestOptions: {
      url: 'http://www.iqshw.com/'
    },
    sitemap: {
      startUrl: 'http://www.iqshw.com/',
      selectors: [
        {
          parentSelectors: ['_root'],
          type: 'SelectorElement',
          multiple: true,
          id: 'item',
          selector: 'div.content:nth-of-type(1) div.news-comm-wrap:nth-of-type(1) li',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'title',
          selector: 'a',
          regex: '',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorLink',
          multiple: false,
          id: 'href',
          selector: 'a',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'date',
          selector: 'em.time',
          regex: '',
          delay: ''
        }],
      _id: 'iqshw'
    },
    transform: {
      date: {
        fn: 'formatDate',
        param: 'MM/DD',
      },
      img: {
        fn: 'defaultValue',
        param: 'http://www.iqshw.com/templets/iqshw_new/logo.jpg'
      },
      intro: {
        fn: 'setFieldValue',
        param: 'title',
      },
      href: {
        fn: 'addPrefix',
        param: 'http://www.iqshw.com'
      }
    },
  },
  {
    site: 'xclient',
    requestOptions: {
      url: 'http://xclient.info/s/'
    },
    sitemap: {
      startUrl: 'http://xclient.info/s/',
      selectors: [
        {
          parentSelectors: ['_root'],
          type: 'SelectorElement',
          multiple: true,
          id: 'item',
          selector: 'ul.post_list li',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'title',
          selector: 'h3',
          regex: '',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'date',
          selector: 'span.item.date',
          regex: '',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorLink',
          multiple: false,
          id: 'href',
          selector: 'div.main > a',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'intro',
          selector: 'p',
          regex: '',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorImage',
          multiple: false,
          id: 'img',
          selector: 'img.lim-icon',
          downloadImage: false,
          delay: ''
        }],
      _id: 'xclient'
    },
    transform: {
      date: {
        fn: 'formatDate',
        param: 'YYYYMMDD',
      },
    },
    pageFun(index) {
      return `http://xclient.info/s/${index}`;
    },
  },
  {
    site: 'edu-ing',
    requestOptions: {
      url: 'http://www.edu-ing.cn/?paged=1'
    },
    transform: {
      date: {
        fn: 'formatDate',
        param: 'YYYYMMDD',
      },
    },
    sitemap: {
      startUrl: 'http://www.edu-ing.cn/?paged=1',
      selectors: [
        {
          parentSelectors: ['_root'],
          type: 'SelectorElement',
          multiple: true,
          id: 'item',
          selector: 'article.excerpt',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'title',
          selector: 'h2 a',
          regex: '',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'date',
          selector: 'p.text-muted.time',
          regex: '\\d{4}-\\d{2}-\\d{2}',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorLink',
          multiple: false,
          id: 'href',
          selector: 'h2 a',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorText',
          multiple: false,
          id: 'intro',
          selector: 'p.note',
          regex: '',
          delay: ''
        },
        {
          parentSelectors: ['item'],
          type: 'SelectorElement',
          multiple: false,
          id: 'img-ele',
          selector: 'img.thumb',
          delay: ''
        },
        {
          parentSelectors: ['img-ele'],
          type: 'SelectorElementAttribute',
          multiple: false,
          id: 'img',
          selector: 'data-original',
          extractAttribute: '',
          delay: ''
        }],
      _id: 'edu-ing'
    }
  },
];
