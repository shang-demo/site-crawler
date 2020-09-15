function formatDate(fmt: string, date = new Date()) {
  const o = {
    '([yY]+)': date.getFullYear(),
    '(M+)': date.getMonth() + 1, // 月份
    '([dD]+)': date.getDate(), // 日
    '([hH]+)': date.getHours(), // 小时
    '(m+)': date.getMinutes(), // 分
    '(s+)': date.getSeconds(), // 秒
    '([qQ]+)': Math.floor((date.getMonth() + 3) / 3), // 季度
    '(S+)': date.getMilliseconds(), // 毫秒
  };
  Object.keys(o).forEach((key) => {
    if (new RegExp(key).test(fmt)) {
      // eslint-disable-next-line no-param-reassign
      fmt = fmt.replace(
        RegExp.$1,
        `00${(o as any)[key]}`.substr(-RegExp.$1.length)
      );
    }
  });
  return fmt;
}

export { formatDate };
