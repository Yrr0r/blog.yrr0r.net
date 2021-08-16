
import { config, compiled } from './common.mjs';
import fs from 'fs';
import Path from 'path';

let outdir = config.build.output;

for(let each in compiled){
	try{
		let fpath = outdir + each; //merge path
		let dir = Path.dirname(fpath);
		if( ! fs.existsSync(dir)){
			fs.mkdirSync(dir, { recursive: true });
		}
		fs.writeFileSync(fpath, compiled[each]);
	} catch(err){
		console.log(err.stack);
		process.exit(-1);
	}
}