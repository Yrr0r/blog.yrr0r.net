import { config, compiled } from './common.mjs';
import http from 'http';
import url from 'url';
import { resourceUsage } from 'process';

http.createServer(handleRequest).listen(config.preview.port, config.preview.addr);

function handleRequest(request, response) {
	response.writeHead(200, { 'Content-Type': 'text/html' });
	response.write(fetch(request.url));
	response.end();
}

function fetch(url){
	let key = url;
	if(key.endsWith('/')) key += 'index.html';
	if(! key.endsWith('.html')) key += '/index.html';
	console.log('Access: ', key);
	let result = compiled[key];
	if(result == undefined){
		return 'File is missing.';
	}
	return result;
}