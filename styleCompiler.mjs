// CSS Compile script
/*
The CSS file is compiled and commited to the repository.
The CSS file will be put into assets path then copied to output by builder.
Changes are kept inside repository.
*/
import Path from 'path';
import {createRequire} from 'module';
import fs from 'fs-extra';
import sass from 'sass';

import { config } from './common.mjs';

const require = createRequire(import.meta.url);
let reqed = require.resolve('bulma');
reqed = Path.dirname(reqed);
console.log(reqed);

let stylefiles = fs.readdirSync(config.styleCompiler.scss);

for(each of stylefiles){
	let source = Path.join(config.styleCompiler.scss, each);
	console.log(source);
	let css = sass.renderSync({
		file : source,
		includePaths:[reqed]
	})
	let outname = each.replace('.scss', '.css');
	fs.writeFileSync(
		Path.join(config.common.assets, outname),
		css.css,

	);
}
