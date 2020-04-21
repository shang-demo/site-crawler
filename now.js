
const path = require('path');
const fs = require('fs-extra');
const lodash = require('lodash');

const rootDir = path.resolve(__dirname, './production');

const excludes = ['init/index.js', 'updates/', 'index.js'].map((str) => {
  return path.resolve(rootDir, str);
});


async function tryRequireDirFiles(dir) {
  const list = await fs.readdir(dir);

  const arr = await Promise.all(list.map(async (p) => {
    if (['.git', 'node_modules'].includes(p)) {
      return [];
    }

    const filePath = path.resolve(dir, p);

    const isExclude = excludes.find((excludeP) => {
      return filePath.startsWith(excludeP);
    });

    if(isExclude) {
      return [];
    }

    const stat = await fs.stat(filePath);

    if (stat.isFile()) {
      return filePath;
    }

    if (stat.isDirectory()) {
      return tryRequireDirFiles(filePath);
    }
  }));

  return arr;
}

function buildRequire(list) {
  return list.map((p) => {
    const relativePath = p.replace(rootDir, '.');

    return `
    try {
      require("${relativePath}");
      delete require.cache[require("${relativePath}")]
    }
    catch(e) {}
    `;
  }).join('\n');
}

async function writeToProduction(str) {
  await fs.writeFile(path.resolve(rootDir, 'now.js'), `process.env.NOW = true; ${str}`);
}


(async () => {
  const list = await tryRequireDirFiles(rootDir);
  const str = buildRequire(lodash.flattenDeep(list));
  await writeToProduction(str);
})();
