// main9.js ) 이 Js파일 내부에서는 main8.js와는 달리
// template의 객체를 파일 외부(./lib/template)에 선언하고 module을 통해 exports 한다.
//그리고 아래와 같은 방식으로 require 형식으로 객체 내부의 함수를 받아와
// 사용하는 방법에 대해 설명하고 있다.

// main10.js ) 이 Js파일 내부에서는 main9.js와는 달리
// 입력 정보의 보안 문제와 관련된 문제와 내용의 대해 설명하고 있다.
// 1. password.js를 생성하고 사용자 정보를 저장할 때,
//    URIpath를 통해서 사용자가 해당 파일에 직접 접근해버릴 수 있다.

// + ) 이 Js파일 내부에서는 main10.js와는 달리
// 출력 정보의 보안 문제와 관련된 문제와 내용의 대해 설명하고 있다.
// 1. 만약 web에서 create페이지를 통해 writeFile함수를 통한 data를 생성했을 때
// <script>alert('data')</script> 와 같은 형식으로 html 내부에서
// 값을 수정할 수 있는 data를 삽입할 경우 출력 정보의 관한 문제가 생길 수 있다.

// + ) 외부 모듈을 사용해 1번 문제를 해결하고자 한다.
// cmd 내부에서 npm init을 수행한다.
// init 과정이 끝나면 package.json가 생성돼 프로젝트 정보를 확인할 수 있다.
// 그리고 나서 npm install -S sanitize-html 을 통해 (-S는 현재 프로젝트 내부에서의 의미, -g는 전체구역이다.)
// html 문서를 읽어올 때 문제가 될 수 있는 문자(<,> etc)를 필터링 해줄 수 있는
// 모듈을 설치 할 수 있다.
// 모듈이 설치되면 node_modules 파일이 생성된다.
// 또한 packge에 "dependencies": {  "sanitize-html": "^1.27.1" }가 추가된 것을 볼 수 있다.

// + ) 후술되는 코드를 이용하고 XSS 웹 페이지를 불러오면 main10.js에서 뜨는 얼럿이
// sanitize된 main11.js에서는 등장하지 않게 된다.

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
// main9.js ) template의 변수에 template.js의 객체를 받았다.
var template = require('./lib/template.js');
// + ) sanitize module 사용 require문
var sanitizeHtml = require('sanitize-html');

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
        // main10.js ) 지정 경로가 아닌 path정보의 base부분만을
        //추출해서 변수에 삽입해서 URI를 통한 다른 파일 열람을 막을 수 있다.
        var filteredID = path.parse(queryData.id).base;
        // main10.js ) readFile내부의 data/${queryData.id}를 ./lib/password.js로
        // 접근하면 중요 파일을 열람해버리는 문제가 생긴다.
        fs.readFile(`data/${filteredID}`, 'utf8', function(err, data) {
          // + ) 기본 문법 var dirty = 'some really tacky HTML';
          // var clean = sanitizeHtml(dirty);
          // 타이틀과 본문 내용을 검열한다.
          // Q. 왜 이 부분을 sanitize 할까 ?
          // A. 이 부분이 파일을 불러와 본문을 출력해주는 부분이다.
          // 정보 출력시 문제가 있다면, 본문을 출력하는 이 내용에 문제가 있는 것이므로
          // 페이지를 표시 해주는 내용을 검열해주면 된다.

          // + ) filteredID를 통해 readfile의 파일경로를 지정 했으므로
          // title이 readFile 밖에서 선언될 필요가 없으므로
          // title을 readFile 안쪽으로 이동시켰다 (list도 같이).
          var title = queryData.id;
          var list = template.List(filelist);
          var sanitizedTitle = sanitizeHtml(title);
          // allowedTags는 XSS파일 내에 <h1>태그를 허용하기 위해 사용했다.
          // 자세한 사용 내용은 https://www.npmjs.com/package/sanitize-html
          var sanitizedData = sanitizeHtml(data, {
            allowedTags : ['h1']
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
