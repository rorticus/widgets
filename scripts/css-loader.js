const fs = require('fs');

require.extensions['.m.css'] = function (module) {
	const defFile = fs.readFileSync(module.filename + '.d.ts', 'utf8');

	const keys = defFile
		.replace(/export const/g, '')
		.replace(/: string;/g, '')
		.trim()
		.split('\n');

	const returnModule = {};

	keys.forEach(key => {
		key = key.trim();
		returnModule[key] = `${key}`;
	});
	returnModule[' _key'] = 'key';

	module.exports = returnModule;
};
