var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var url = require('url');

var server = http.createServer(handleRequest);

function handleRequest(req, res) {
    var store = '';

    req.on('data', (chunk) => {
        store += chunk;
    })
    req.on('end', () => {
        var parsedUrl = url.parse(req.url).pathname;
        var parsedQuery = url.parse(req.url).query;
        var queryObj = url.parse(parsedQuery);
        if(req.method === 'GET' && req.url === '/') {
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream('./index.html').pipe(res);
        } else if(req.method === 'GET' && req.url === '/contact') {
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream('./contact.html').pipe(res);
        } else if(req.method === 'GET' && parsedUrl === '/assets/stylesheets/style.css') {
            res.setHeader('Content-Type', 'text/css');
            fs.createReadStream('assets/stylesheets/style.css').pipe(res);
        } else if(req.method === 'GET' && parsedUrl === 'assets/camera.jpg') {
            res.setHeader('Content-Type', 'image/jpg');
            fs.createReadStream('assets/camera.jpg').pipe(res);
        } else if(req.method === 'POST' && req.url === '/form') {
            var formObj = qs.parse(store);
            var pathFile = path.join(__dirname, 'contacts', `${formObj.username}.json`);
            fs.open(pathFile, 'wx', (err, fd) => {
                if(err) return console.log(err);
                fs.close(fd, () => {
                    res.setHeader('Content-Type', 'text/html');
                    res.end(`<h2>${formObj.username}.json is created`);
                });
            });
        } else if(req.method === 'GET' && parsedUrl === '/users' && 'username' in queryObj) {
            fs.readFile(`./contacts/${queryObj.username}.json`, (err, data) => {
                if(err) return console.log(err);
                var selectObj = JSON.parse(data);
                res.setHeader('Content-Type', 'text/html');
                res.write(`<h2>Name:${selectObj.name}</h2>`);
                res.write(`<h2>Name:${selectObj.email}</h2>`);
                res.write(`<h2>Name:${selectObj.username}</h2>`);
                res.write(`<h2>Name:${selectObj.age}</h2>`);
                res.write(`<h2>Name:${selectObj.bio}</h2>`);

            });
        } else if(req.method === 'GET' && parsedUrl === '/users') {
            var directoryPath = path.join(__dirname, 'contacts');
            fs.readdir(directoryPath, function (err, files) {
                if(err) {
                    return console.log('Unable to scan:' + err);
                }
                res.setHeader('Content-Type', text/html);
                files.forEach(function (file) {
                    fs.readFile(`./contacts/${file}`, (err, data) => {
                        if(err) return console.log(err);
                        var selectObj = JSON.parse(data);
                        res.write(`<h2>Name:${selectObj.name}</h2>`);
                        res.write(`<h2>Name:${selectObj.email}</h2>`);
                        res.write(`<h2>Name:${selectObj.username}</h2>`);
                        res.write(`<h2>Name:${selectObj.age}</h2>`);
                        res.write(`<h2>Name:${selectObj.bio}</h2>`);
                    });
                });
            });
        }
        else {
            res.statusCode = 404;
            res.end('404: Not Found');
        }
    })
}

server.listen(5000, () => {
    console.log('Server listening on port 5000');
})