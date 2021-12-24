
console.log("main.mjs called");

var config = {
	common: {
		postdir: "./articles", // where all post articles go
		assets: './assets', // static assets.
		webroot: './webroot', // additional root-level files
		attachments: "./attachments", // where to put attached image and files.
		templates: "./templates", //location of all templates.
		aboutpage: "./about.md", //about me on index page.
	},
	roots:{
		posts: '/posts', // post root.
	},
	templates:{ // template render constants.
		title:'可爱的Yrr！' // Title of site listing.
	},
	preview:{
		addr: '0.0.0.0',
		port: 8787
	},
	build:{
		output: "./public" // where generated outputs go
	},
	styleCompiler:{
		scss: './styles' // where all scss files are kept to be compiled.
	}
};
export {config}

import fs from 'fs-extra';
import fm from 'front-matter';
import Ejs from 'ejs';
import marked from 'marked';
import highlight from 'highlight.js';
import Path from 'path';

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
	xhtml: false,
	headerIds: false
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
	content.path = filepath;
	content.html = marked(content.body);

	return content;
}

let folders = dirWalk(config.common.postdir);
let articles = folders.files;
//console.log('Listings:', folders);

let rendered = {} ;
for(let nth in articles){
	let processed = procMd(articles[nth]);
	let path = articles[nth];
	path = path.replace('.md', '.html');
	
	try{
		rendered[path] = processed;
	} catch(err){
		console.log(err.stack);
		continue;
	}
}

// Compile articles
let permalinks = {};
let articlePages = {};
let articleInfo = {};
let articleTemplate = Ejs.compile(fs.readFileSync(config.common.templates + '/reader.ejs', 'utf-8'));
for (let each in rendered){
	let path = (config.roots.posts + each.replace(config.common.postdir, ''));
	let body = rendered[each].html;
	let attrib = rendered[each].attributes
	articleInfo[path] = attrib;
	let templateParams = {
		body: body,
		path: path.split('/').slice(1),
		metadata: attrib,
		breadcrumb: true
	};
	
	// Process Permalinks
	if(attrib.permalink != undefined){
		permalinks[attrib.permalink] = path;
	}
	
	let page;
	if(path.endsWith('index.html')) {
		//put index in without any rendering.
		page = body;
	} else {
		page = articleTemplate(templateParams); // render article pages
	}
	articlePages[path] = page;
}
//console.log('Pages: ', Object.keys(articlePages));

// Generating listing pages
let ftree = folders.folders;
let indexes = {};
let listingTemplate = Ejs.compile(fs.readFileSync(config.common.templates + '/articleListing.ejs', 'utf-8'));
for (let each in ftree){
	//declare parameter variable.
	let indexParams = {info: articleInfo}; // articleInfo is an array of all article metadata.
	// if index.md exist, its path will be below.
	let indexPath = (config.roots.posts + each.replace(config.common.postdir, '') + '/index.html' );
	indexParams['path'] = indexPath.split('/').slice(1, -1);
	let subdirs = ftree[each];
	indexParams.links = {};
	indexParams.title = config.templates.title;
	for(let each of subdirs){
		// process the list of files inside its path.
		

		each = each.replace(config.common.postdir, '');
		each = each.replace('.md', '.html');
		each = config.roots.posts + each; // put post root inside it.
		if(each.endsWith('index.html')) continue; //ignore already generated index as pages.
		indexParams.links[each] = ''; // links that only belongs to this page
	}
	//console.log('indexParams', indexParams);
	if(articlePages[indexPath] != undefined){
		// a index.md file is found, inject it.
		indexParams.indextext = articlePages[indexPath];
	} else {
		indexParams.indextext = '';
	}

	indexes[indexPath] = listingTemplate(indexParams);
}

//console.log('Indexes', indexes);

let posts = {...articlePages, ...indexes};
//console.log('Posts: ', Object.keys(posts))
//export {posts};

// render index
let indextext = fs.readFileSync(config.common.aboutpage, 'utf-8');
let indexTemplate = Ejs.compile(fs.readFileSync(config.common.templates + '/index.ejs', 'utf-8'));
let index = indexTemplate({
	title: config.templates.title,
	aboutme: marked(indextext),
});

// Put permalink JSON file:
posts['/permalink.json'] = JSON.stringify(permalinks);

//temprary work, fix later:
posts['/index.html'] = index;
console.log('Compiled: ', Object.keys(posts))
export {posts};