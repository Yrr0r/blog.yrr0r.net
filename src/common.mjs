console.log("main.mjs called");

var config = {
	common: {
		postdir: "./pages", // where all post articles go
		attachments: "./attachments", // where to put attached image and files.
		templates: "./templates",
		
	},
	preview:{
		addr: '127.0.0.1',
		port: 8091
	},
	build:{
		output: "./public", // where generated outputs go
	}
};

import fs from 'fs';
import marked from 'marked';
import fm from 'front-matter';
import highlight from 'highlight.js';

marked.setOptions({
	renderer: new marked.Renderer(),
	highlight: function (code, language) {
		//ESM style imported, use 'highlight' to call it.
		const validLanguage = highlight.getLanguage(language) ? language : "plaintext";
		return highlight.highlight(code, {language: validLanguage}).value ;
	},
	pedantic: false,
	gfm: true,
	breaks: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	xhtml: false
});

function dirWalk(dir) {
	var filelist = [];
	var folders = {};
	
	var list = fs.readdirSync(dir);
	folders[dir] = []; //put list to obj
	list.forEach(function (file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		folders[dir].push(file); //push this directory to tree.
		if (stat && stat.isDirectory()) {
			/* Recurse into a subdirectory */
			let subCall = dirWalk(file); //store all listing in a variable
			filelist = filelist.concat(subCall.files); //put filenames in
			Object.assign(folders, subCall.folders); //merge returned folder
		} else {
			/* Is a file */
			filelist.push(file);
			
		}
	});
	var result = {files: filelist, folders: folders};
	return result;
}

function procMd(filepath) {
	var data = fs.readFileSync(filepath, 'utf-8');
	var content = fm(data);
	//console.log(content);
	content.path = filepath;

	content.html = marked(content.body);

	return content;
}

let folders = dirWalk(config.common.postdir);
let articles = folders.files;
console.log('Listings:', folders);

let rendered = {} ;
for(let nth in articles){
	let processed = procMd(articles[nth]);
	let path = articles[nth];
	
	try{
		rendered[path] = processed;
	} catch(err){
		console.log(err.stack);
		continue;
	}
}

// Compile articles
let articlePages = {};
for (let each in rendered){
	let path = each.replace(config.common.postdir, '');
	path = path.replace('.md', '.html');
	let body = rendered[each].html;
	let page = `
	<head>
	<meta charset="utf-8">
	</head>
	<body>
	${body}
	</body>
	`;
	articlePages[path] = page;
}
//console.log('Pages: ', articlePages);

// Generating Indexes
let ftree = folders.folders;
let indexes = {};
for (let each in ftree){
	let newname = each.replace(config.common.postdir, '');
	newname += '/index.html';
	let subdirs = ftree[each];
	let pagehtml = '<h1> Index page </h1>';
	for(let each of subdirs){
		each = each.replace(config.common.postdir, '')
		each = each.replace('.md', '.html');
		let link = `<p> <a href=${each}>${each}</a> </p>`;
		pagehtml += link;
	}
	indexes[newname] = pagehtml;
}

console.log('Indexes', indexes);

let compiled = {...articlePages, ...indexes};
export {config, compiled};