const config = {
	common: {
		postdir: "./articles", // where all post articles go
		assets: './assets', // static assets.
		webroot: './webroot', // additional root-level files
		attachments: "./attachments", // where to put attached image and files.
		templates: "./templates", //location of all templates.
		indexpage: "./index.md", //about me on index page.
	},
	ignores:[
		".DS_Store",
	],
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

export {config};