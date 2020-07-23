var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');

function create(addr) {
  return fs.readFileSync(addr, 'utf8');
}

/*
http.createServer([requestListener])
returns : <http.Server>
Server.listen() : createServer의 리턴값을 통해 http서버를 구동시킨다
요청이 들어올 때마다 callback 함수를 호출한다.
request : 웹브라우저로부터 들어오는 정보
response : 사용자 전송하고 싶은 정보
*/
var app = http.createServer(function(request, response) {

  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var queryPath = url.parse(_url, true).pathname;
  if (queryPath === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function(error, filelist) {
        var title = 'Welcome';
        var data = 'Hello Node.js';
        var list = template.List(filelist);
        var HTML = template.Html(title, list,
          `<h2>${title}</h2><p>${data}</p>`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(HTML);
      });
    } else {
      fs.readdir('./data', function(error, filelist) {
        var filteredID = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredID}`, 'utf8', function(err, data) {
          var title = queryData.id;
          var list = template.List(filelist);
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedData = sanitizeHtml(data, {
            allowedTags: ['h1']
          });
          var HTML = template.Html(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2><p>${sanitizedData}</p>`,
            `<a href="/create">create</a>
            <a href="/update?id=${sanitizedTitle}">update</a>
            <form action="http://localhost:3000/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
            </form> `);
          response.writeHead(200);
          response.end(HTML);
        });
      });
    }
  } else if (queryPath === '/create') {
    fs.readdir('./data', function(error, filelist) {
      var title = 'create';
      var list = template.List(filelist);
      var HTML = template.Html(title, list, create('./create/create.html'), '');
      response.writeHead(200);
      response.end(HTML);
    });
  } else if (queryPath === '/create_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var title = post.title;
      var data = post.description;
      fs.writeFile(`data/${title}`, data, 'utf8', function(err) {
        response.writeHead(302, {
          Location: `/?id=${title}`
        });
        response.end();
      });
    });
  } else if (queryPath == '/update') {
    fs.readdir('./data', function(error, filelist) {
      var title = queryData.id;
      var list = template.List(filelist);
      var filteredID = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredID}`, 'utf8', function(err, data) {
        var HTML = template.Html(title, list,
          `<form action="http://localhost:3000/update_process" method="post">
           <input type="hidden" name="id" value="${title}">
           <p><input type="text" name="title" value="${title}"></p>
           <p>
             <textarea name="description">${data}</textarea>
           </p>
           <p><input type="submit"></p>
           </form>`,
          `<a href="/create">create</a>  <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(HTML);
      });
    });
  } else if (queryPath === '/update_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var data = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(err) {
        fs.writeFile(`data/${title}`, data, 'utf8', function(err) {
          response.writeHead(302, {
            Location: `/?id=${title}`
          });
          response.end();
        });
      });
    });
  } else if (queryPath === '/delete_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var filteredID = path.parse(id).base;
      fs.unlink(`data/${filteredID}`, function(err) {
        response.writeHead(302, {
          Location: `/`
        });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
// Server.listen의 관한 옵션은 다음 도큐먼트에서 확인할 수 있다.
// https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_server_listen
