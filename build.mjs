
import { config, posts } from './common.mjs';
import mock from 'mock-fs';
import fs from 'fs-extra';
import Path from 'path';
import servestatic from 'serve-static';
import finalhandler from 'finalhandler';
import http from 'http';

// detect preview mode
var preview = (
	process.argv.includes('--preview') || process.argv.includes('-p')
);
// if preview, read all current files and enable mockfs
if( preview ){
	var files = {};
	fs.readdirSync('./').forEach(file => {
		files[file] = mock.load(file);
	})
	mock(files, {recursive: true});
}

let outdir = config.build.output;
// write all documents
for(let each in posts){
	try{
		let fpath = outdir + each; //merge path
		let dir = Path.dirname(fpath);
		if(! fs.existsSync(dir)){
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
// copy all attachments
fs.copySync(config.common.attachments, config.build.output + '/attachments');
//copy all other important root files
fs.copySync(config.common.webroot, config.build.output);


// if preview, start preview server
if(preview){
	// Instantiate serve-static
	let serve = servestatic(config.build.output);

	// Initiate request handler
	function handleRequest(req, res){
		console.log(req.method, req.url);
		serve(req, res, finalhandler(req, res));
	}
	
	//setup web server to serve files
	http.createServer(handleRequest).listen(config.preview.port, config.preview.addr);
	console.log("Listening ", config.preview.addr,' Port ', config.preview.port)
}
