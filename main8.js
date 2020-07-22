// main6.js ) 이 Js파일 내부에서는 main5.js와는 달리
// update 웹 페이지를 구현하는 방법에 대해 설명하고 있다.

// main7.js ) 이 Js파일 내부에서는 main6.js와는 달리
// delete 웹 페이지를 구현하는 방법에 대해  설명하고 있다.

// + ) 이 Js파일 내부에서는 main7.js와는 달리
// teamplate로 시작되는 함수를 객체 타입에 넣어
// 각 변수를 함수로 호출하는 방식으로 교체하는 방법에 대해 설명하고 있다.

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


// main7.js ) update 웹기능을 추가하기 위해, create가 표시된 부분을
// control의 변수로 묶었다.
// 이 때, update은 root로 접속 했을 때는 출력이 안되게 설정한다.
// + ) template 라는 변수를 만들어 필요 함수를 내부 변수로 선언했다.
// 기존의 template는 HTML이라는 변수명으로 교체했다.
var template = {
  Html: function(title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>`
  },
  List: function(filelist) {
    var list = '<ul>';
    for (var i = 0; i < filelist.length; i++) {
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
    }
    list += '</ul>';
    return list;
  }
}

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
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data) {
          // main7.js )
          // <input type="submit" value="delete"> 을 이용해
          // delete 기능을 모든 목차에 생성한 후,
          // post 방식으로 처리한다. (href로 처리했던 기존 방식은 get이다.)
          // 이 때, 지우려고 하는 현재 id가 필요하기에 hidden input 타입을 선언했다.
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
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data) {
        // main6.js ) hidden 타입을 추가해서 바꾸려는 현재 title 값을 고정시켜 놓는다
        // hidden 타입의 input을 추가하지 않을 경우 사용자가 title명을 변경하고자 할 때
        // 원래 파일의 title 값을 알수 없는 문제가 발생한다
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
    // main6.js ) update를 통해 submit 진행시 update_process 페이지로 이동한다.
    // 이동 한 뒤에 id title data를 얻어와 파일 이름과 내용을 변경하고
    // 업데이트 했던 페이지로 리다이렉션한다.
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
      // main6.js )  fs.rename(olddirname, newdirname, callback)
      // id를 통해서 현재 파일 이름을 얻고
      // title을 통해서 title로 파일명을 변경한다.
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
      // main7.js ) delete form에서 넘기는 데이터는 id 밖에 없다.
      // 따라서 id만 선언하면 된다.
      var id = post.id;
      // main7.js ) fs.unlik('path/text',callback(err))
      fs.unlink(`data/${id}`, function(err) {
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
