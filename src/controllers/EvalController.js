/* eslint-disable no-eval */

const ctrl = {
  async eval(ctx) {
    let result;
    try {
      result = eval(ctx.request.body.str);
      ctx.body = {
        data: result
      };
    }
    catch (e) {
      ctx.wrapError(e);
    }
  },
  async evalZDFans(ctx) {
    let html = ctx.request.body.html;
    let jschlVc = html.match(/name="jschl_vc" value="(\w+)"/)[1];
    let pass = html.match(/name="pass" value="([^"]+)"/)[1];
    let str1 = html.match(/var\s+s.*;/)[0];
    let str2 = ';t=\'www.zdfans.com\';';
    let str3 = html.match(/\s*;.*(?=';\s*121)/)[0] || '';
    str3 = str3.replace(/a\.value\s*=/, 'var jschlAnswe=');

    let jschlAnswe = eval(`(function(){${str1 + str2 + str3}; return jschlAnswe}())`);
    let result = `http://www.zdfans.com/cdn-cgi/l/chk_jschl?jschl_vc=${encodeURIComponent(jschlVc)}&pass=${encodeURIComponent(pass)}&jschl_answer=${jschlAnswe}`;

    ctx.body = {
      data: result,
    };
  },
};

module.exports = ctrl;
