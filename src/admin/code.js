async function run() {
  // 正常采集逻辑
}

if (typeof browser !== 'undefined') {
  return run();
} else {
  require('./head')
    .init()
    .then(() => {
      return run();
    })
    .then((data) => {
      require('fs').writeFile('./out.json', JSON.stringify(data), (error) => {
        console.warn(error);
      });
    });
}
