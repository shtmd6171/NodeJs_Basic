// 해당 주석들은 웹 페이지의 주소부분인 queryString의 값이  id = synta 의 형태로 고치고
// 웹사이트에 접속시에 다른 id 값을 가질 때 다른 화면을 보여주게 도와주는 내용을 다루고 있다.

// main2.js ) 이 Js파일 내부에서는 main.js와는 달리 fileread를 통해 원시파일을 불러
// <title>과 <h2>뿐만 아니라 본문의 <p></p> 사이의 내용 또한
// 각 id 마다 다르게 설정하는 방법을 설명하고 있다.

// + ) 이 Js파일 내부에서는 main2.js와는 달리 pathname을 이용해서
// 정상적인 방식으로 웹페이지를 접속 했을 때 컨텐츠를 표시하게 했고
// 그렇지 않은 경우 오류를 출력하게 변경하였다.
// 또한 메인페이지로 접속 했을 때 각 내용이 undefined로 출력되는 내용을 수정했다.

// 추가된 내용에는 '+ )'를 달아두었다.
// 필요 없는 내용은 삭제하였다. 삭제 전 내용은 전 파일 주석을 통해 확인 가능하다.

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

    // + )
    // console.log(url.parse(_url, ture)); 를 통해서 어떤 메소드 값을 도출하는지 알 수 있다.
    // pathname은 quertString 전의 구분자인 '/'를 담고 있다.
    // 웹 브라우저의 원본페이지(root)로 접속했을 때 pathname은 '/'를 담고 있다.
    var queryPath = url.parse(_url, true).pathname;

    // + )
    // 만약 원본페이지(root) 페이지로 접속 했을 시에는 main2.js까지의 내용을 실행하고
    // 그렇지 않은 경우(quertString 값에 존재하지 않는 주소, ex localhost:3000/fatal)는
    // 오류를 반환한다.
    if(queryPath === '/') {
      // + ) queryData.id가 없다는 것은 가장 처음 메인 페이지를 의미한다.
      // 메인 페이지는 queryData.id가 없기 때문에 main2.js방식을 이용할 경우
      // title과 data가 undefined가 출력되기 때문에 변수로 직접 지정했다.
      // 이 구간에서는 파일을 불러오지 않기 때문에 fileread 내용을 삭제했다.
      if(queryData.id === undefined) {
         title = 'Welcome';
         data = 'Hello Node.js';
         var template = `
         <!doctype html>
         <html>
         <head>
           <title>WEB1 - ${title}</title>
           <meta charset="utf-8">
         </head>
         <body>
           <h1><a href="/">WEB</a></h1>
           <ol>
             <li><a href="/?id=HTML">HTML</a></li>
             <li><a href="/?id=CSS">CSS</a></li>
             <li><a href="/?id=JavaScript">JavaScript</a></li>
           </ol>
           <h2>${title}</h2>
           <p>${data}</p>
         </body>
         </html>`;

         response.writeHead(200);
         response.end(template);
       } else {
         // main2.js )
         // data 디렉터리 밑의 queryData.id의 값인  HTML, CSS, JavaScript 의 파일명을 불러온다.
         // data 폴더가 다른 경로에 있을 경우 절대경로로 지정해줘야 한다.
         // data 파일 밑의 내용은 <p></p> 안에 들어갈 본문 내용만 들어있는 것으로
         // 해당 파일의 내용을 data로 불러와 template의 <p></p>사이에 넣어 대체했다.
         fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data) {
         var title = queryData.id;
         var template = `
         <!doctype html>
         <html>
         <head>
           <title>WEB1 - ${title}</title>
           <meta charset="utf-8">
         </head>
         <body>
           <h1><a href="/">WEB</a></h1>
           <ol>
             <li><a href="/?id=HTML">HTML</a></li>
             <li><a href="/?id=CSS">CSS</a></li>
             <li><a href="/?id=JavaScript">JavaScript</a></li>
           </ol>
           <h2>${title}</h2>
           <p>${data}</p>
         </body>
         </html>`;
         // response.end(syntax)는 syntax를 읽어주는 코드임.
         // syntax 내에 삽입되는 내용이 web내에서 표시됨
         response.writeHead(200);
         response.end(template);
         });
       }
     } else {
      response.writeHead(404);
      response.end('Not found');
    }



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
