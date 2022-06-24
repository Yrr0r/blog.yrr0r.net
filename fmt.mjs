// this script formats and initialize article front matters.

import { config } from "./config.mjs";
import {v4 as uuidv4} from "uuid";
import fm from "front-matter";
import fs from "fs";

function genhead(parsed){
	let attr = parsed.attributes;
	let changed = false;

	let result = "---\n";
	if(attr.permalink == undefined){
		let permalink = uuidv4();
		result += `permalink: ${permalink} \n`;
		changed = true;
	}
	if(parsed.frontmatter != undefined) result += parsed.frontmatter;
	result += "\n\n---\n";
	result += parsed.body;

	if(changed == true) return result;
	else return null;
}

function procfm(filename){
	let text = fs.readFileSync(filename, 'utf-8');
	let parsed = fm(text); 
	let result = genhead(parsed);

	if(result){
		console.log('Updated file: ', filename);
		fs.writeFileSync(filename, result);
		return 1;
	} else {
		console.log('Unchaged: ', filename);
		return 0;
	}
}

// recurse into directory.
var dir = config.common.postdir;

function dirWalk(dir) {	
	let count = 0; 
	let chgd = 0;
	var list = fs.readdirSync(dir);
	list.forEach(function (file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			/* Recurse into a subdirectory */
			let ret = dirWalk(file); //store all listing in a variable
			count += ret[0]; chgd += ret[1]; // add counters
		} else if(file.endsWith(".md")) {
			/* Is a md file */
			let stat = procfm(file);
			count ++;
			if(stat) chgd ++;
		} // other files not touched.
	});
	return [count, chgd];
}

// detect preview mode
var genonly = (
	process.argv.includes('--gen') || process.argv.includes('-g') || process.argv.includes('gen')
);
if(genonly){
	console.log("Paste the following to the beginning of new document. \n");
	
	let date = new Date();
	let datestr = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`

	let tmpl = `---
date: ${datestr}
title: Title here or delete this line.
abstract: Abstract here or delete this line.

---

	`
	console.log(genhead(fm(tmpl)));
} else {
	let stat = dirWalk(dir);
	console.log("Done. Total ", stat[0], " Files ; Changed ", stat[1], " Files.");
}