// 해당 주석들은 웹 페이지의 주소부분인 queryString의 값이  id = synta 의 형태로 고치고
// 웹사이트에 접속시에 다른 id 값을 가질 때 다른 화면을 보여주게 도와주는 내용을 다루고 있다.

var http = require('http');
var fs = require('fs');
// require('url')를 통해서 url과 관련된 모듈(메소드)을 사용하게 한다.
var url = require('url');
var app = http.createServer(function(request,response){

    // request.url은 url의 path뒤 queryString의 값이다. 아무것도 없을 때는 '/'
    var _url = request.url;
    console.log(_url);

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
    // 현재는 1.html 페이지를 보려면 href의 코드를 따라서
    // http://localhost:3000/1.html로 이동했었다.
    // 그러나 /?id=html로 변경하게 되면 href가 queryString의 형태로 변경되는 것이다.
    // 따라서 이 이후에는 http://localhost:3000/?id=html로 접속된다.
    // 그리고 template 에서는 queryData.id를 통해서, url 값이 변경된 내용을  적용한다.
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
        <li><a href="/?id=html">HTML</a></li>
        <li><a href="/?id=css">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ol>
      <h2>${queryData.id}</h2>
      <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
      <img src="coding.jpg" width="100%">
      </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
      </p>
    </body>
    </html>`
    // response.end(syntax)는 syntax를 읽어주는 코드임.
    // syntax 내에 삽입되는 내용이 web내에서 표시됨
    response.end(template);

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
