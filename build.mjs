
import { config, posts } from './common.mjs';
import fs from 'fs-extra';
import Path from 'path';

let outdir = config.build.output;

// write all documents
for(let each in posts){
	try{
		let fpath = outdir + each; //merge path
		let dir = Path.dirname(fpath);
		if( ! fs.existsSync(dir)){
			fs.mkdirSync(dir, { recursive: true });
		}
		fs.writeFileSync(fpath, posts[each]);
	} catch(err){
		console.log(err.stack);
		process.exit(-1);
	}
}

// copy all assets
fs.copySync(config.common.assets, config.build.output + '/assets');

// copy favicon
fs.copySync('./favicon.ico', config.build.output + '/favicon.ico');