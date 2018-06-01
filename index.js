const http = require('http');
const fs = require('fs');
const path = require('path');

const config = {
	root: '.',
	default: 'index.html',
	port: process.env.PORT || 3000,
	mime: {
		'.html': 'text/html',
		'.css': 'text/css',
		'.js': 'text/javascript',
		'.json': 'application/json',
		'.jpg': 'image/jpeg',
		'.png': 'image/png',
		'.svg': 'image/svg+xml',
		'.eot': 'application/vnd.ms-fontobject',
		'.ttf': 'application/x-font-ttf',
		'.woff': 'application/font-woff',
		'.woff2': 'application/font-woff2',
	}
};

const server = http.createServer((req, res) => {
	let filePath = config.root + req.url + ((req.url == '/') ? config.default : '');

	let ext = path.extname(filePath);
	let contentType = config.mime[ext];

	fs.readFile(filePath, (err, data) => {
		if(err) {
			if(err.code == 'ENOENT') {
				res.writeHead(404);
				res.end('404 not found');
			} else {
				res.writeHead(500);
				res.end('500 Internal Server Error');
			}
		} else {
			res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': data.length });
			res.end(data, 'utf-8');
		}
	});

}).listen(config.port, (err) => {
	if(err) {
		throw err;
	}

	console.log(`Server listen on ${config.port}`);
});