// main9.js ) 이 Js파일 내부에서는 main8.js와는 달리
// template의 객체를 파일 외부(./lib/template)에 선언하고 module을 통해 exports 한다.
//그리고 아래와 같은 방식으로 require 형식으로 객체 내부의 함수를 받아와
// 사용하는 방법에 대해 설명하고 있다.

// + ) 이 Js파일 내부에서는 main8.js와는 달리
// 보안 문제와 관련된 문제와 내용의 대해 설명하고 있다.
// 1. password.js를 생성하고 사용자 정보를 저장할 때,
//    URIpath를 통해서 사용자가 해당 파일에 직접 접근할 수 있다.

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
// main9.js ) template의 변수에 template.js의 객체를 받았다.
var template = require('./lib/template.js')

function create(addr) {
  return fs.readFileSync(addr, 'utf8');
}

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
        var title = queryData.id;
        var list = template.List(filelist);
        //  + ) 지정 경로가 아닌 path정보의 base부분만을
        //추출해서 변수에 삽입해서 URI를 통한 다른 파일 열람을 막을 수 있다.
        var filteredID = path.parse(queryData.id).base;
        // + ) readFile내부의 data/${queryData.id}를 ./lib/password.js로
        // 접근하면 중요 파일을 열람해버리는 문제가 생긴다.
        fs.readFile(`data/${filteredID}`, 'utf8', function(err, data) {
          var HTML = template.Html(title, list,
            `<h2>${title}</h2><p>${data}</p>`,
            `<a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <form action="http://localhost:3000/delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
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
      // + ) unlink를 통해서 data 파일 내부에 접근할 수 있으므로
      // 이 구역에서 base만을 표시한다.
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
