#! env node

import { config, compiled } from './common.mjs';
import http from 'http';
import fs from 'fs-extra';

http.createServer(handleRequest).listen(config.preview.port, config.preview.addr);
console.log("Listening ", config.preview.addr,' Port ', config.preview.port)

function handleRequest(request, response) {
	let fetched = fetch(request.url);
	if(fetched == undefined || fetched == 0){
		response.writeHead(404, {});
		response.end();
	} else {
		response.writeHead(200, {});
		response.write(fetched);
		response.end();
	}
}

function fetch(url){
	let decodedUrl = decodeURI(url);
	decodedUrl = decodedUrl.split('?')[0]
	let key = decodedUrl;
	if(key.endsWith('/')) key += 'index.html';
	if(! key.endsWith('.html')) key += '/index.html';
	console.log('Lookup: ', key);
	let result = compiled[key];
	if(result == undefined){
		console.log('Not exist, lookup assets.');
		let res = handleResources(decodedUrl);
		return res;
	}
	return result;
}

function handleResources(url){
	if(url.startsWith('/assets')){
		let assetpath = config.common.assets;
		let filepath = assetpath + url.replace('/assets', '');
		console.log('Get Asset: ', filepath);
		let file = 0;
		try{
			file = fs.readFileSync(filepath, 'utf-8');
		}catch(err){
			file = 0;
		}
		return file;
	} else if(url = '/favicon.ico') {
		// favicon.ico
		let file;
		try{
			file = fs.readFileSync('./favicon.ico'); // no utf8 here since its raw file.
			console.log('Got favicon.ico')
		}catch(err){
			console.log(err.stack);
		}
		return file;
	}
}