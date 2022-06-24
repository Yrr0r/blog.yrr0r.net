# blog.yrr0r.net

This is my static blog. It's constantly under (slowly) development and evolving. I wrote this page generator myself. Visit the site to read rendered articles. 



## Build and test commands:

- Compile the site: `npm run build`

- Formatting files and adding front-matter: `npm run fmt`

- Only generate a new frontmatter and print to the console: `npm run fmt gen`

- Preview site without writing anything to disk: `npm run preview`

- Compile the CSS assets: `npm run style`   

- Just testing the compiler core: `npm run test`

## Use of directories:

- articles: my writings, can contain subdir
- assets: js and css files
- attachments: image attachments, associated files and other files I got from internet
- styles: SCSS source files
- templates: EJS templates
- webroot: bypassed directly to webroot
