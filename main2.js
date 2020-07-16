// 해당 주석들은 웹 페이지의 주소부분인 queryString의 값이  id = synta 의 형태로 고치고
// 웹사이트에 접속시에 다른 id 값을 가질 때 다른 화면을 보여주게 도와주는 내용을 다루고 있다.

// + ) 이 Js파일 내부에서는 main.js와는 달리 fileread를 통해 원시파일을 불러
// <title>과 <h2>뿐만 아니라 본문의 <p></p> 사이의 내용 또한
// 각 id 마다 다르게 설정하는 방법을 설명하고 있다.

// 추가된 내용에는 '+ )'를 달아두었다.
// main3.js 에서는 24 - 33 번 줄을 삭제 , 34 줄의 위치를 62번으로 옮김

var http = require('http');
var fs = require('fs');
// require('url')를 통해서 url과 관련된 모듈(메소드)을 사용하게 한다.
var url = require('url');
var app = http.createServer(function(request,response){

    // request.url은 url의 path뒤 queryString의 값이다. 아무것도 없을 때는 '/'
    var _url = request.url;

    // url.parse(syntax)를 통해 queryString인 syntax의 url를 분석하는데
    // 해당 url의 오브젝트의 값이 quertData에 전송된다 {id : html}
    // 그 이후에 queryData.id를 통해 html만을 얻어낼 수 있다.
    var queryData = url.parse(_url, true).query;
    console.log(queryData);
    // 아무것도 없을 때는 '/'이기 때문에 해당 내용을 실행한다.
    if(_url == '/'){
     queryData.id = "hello";
    }
    if(_url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    // + )
    // data 디렉터리 밑의 queryData.id의 값인  HTML, CSS, JavaScript 의 파일명을 불러온다.
    // data 폴더가 다른 경로에 있을 경우 절대경로로 지정해줘야 한다.
    // data 파일 밑의 내용은 <p></p> 안에 들어갈 본문 내용만 들어있는 것으로
    // 해당 파일의 내용을 data로 불러와 template의 <p></p>사이에 넣어 대체했다.
    fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data) {
      var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${queryData.id}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${queryData.id}</h2>
        <p>${data}</p>
      </body>
      </html>`;
      // response.end(syntax)는 syntax를 읽어주는 코드임.
      // syntax 내에 삽입되는 내용이 web내에서 표시됨
      response.end(template);
    })



});
app.listen(3000);


/*
server.addListener('request', function (request, response) {
    console.log('requested...');
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.write('Hello nodejs');
    response.end();
});

server.addListener('connection', function(socket){
    console.log('connected...');
});
이 방법을 사용하면 좀 더 다양한 이벤트를 처리할 수 있습니다.
즉, 요청 이벤트인 'request' 와 클라이언트 접속 이벤트인 'connection' 를 따로 처리할 수 있습니다.
http://www.nextree.co.kr/p8574/
*/
