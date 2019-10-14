const glob = require('glob');
const path = require('path');
const fs = require('fs');

const srcPath = path.resolve(__dirname, '..', 'src');

const testFiles = glob.sync(`${srcPath}/**/*.spec.{ts,tsx}`);

const lines = testFiles.map(
	(file) => `require('${file.replace(srcPath, '../../src').replace(/.spec.tsx?$/, '.spec')}');`
);

const unitDir = path.resolve(__dirname, 'unit');

!fs.existsSync(unitDir) && fs.mkdirSync(unitDir);
fs.writeFileSync(path.resolve(unitDir, 'all.ts'), lines.join('\n'));
