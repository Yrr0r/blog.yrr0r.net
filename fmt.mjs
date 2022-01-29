// this script formats and initialize article front matters.

import { config } from "./common.mjs";
import {v4 as uuidv4} from "uuid";
import fm from "front-matter";
import fs from "fs";

function procfm(filename){
	let text = fs.readFileSync(filename, 'utf-8');
	let parsed = fm(text);
	let attr = parsed.attributes;
	let changed = false;
	
	let result = "---\n";
	if(attr.permalink == undefined){
		let permalink = uuidv4();
		result += `permalink: ${permalink} \n`;
		changed = true;
	}
	if(parsed.frontmatter != undefined) result += parsed.frontmatter;
	result += "\n---\n";
	result += parsed.body;

	if(changed == true){
		console.log('Updated file: ', filename);
		fs.writeFileSync(filename, result);
	} else {
		console.log('Unchanged: ', filename);
	}
}

// recurse into directory.
var dir = config.common.postdir;

function dirWalk(dir) {	
	var list = fs.readdirSync(dir);
	list.forEach(function (file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			/* Recurse into a subdirectory */
			dirWalk(file); //store all listing in a variable
		} else if(file.endsWith(".md")) {
			/* Is a md file */
			procfm(file);
		} // other files not touched.
	});
}

dirWalk(dir);
console.log("Done.")