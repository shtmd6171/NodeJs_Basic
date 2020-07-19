// +  ) 이 Js파일 내부에서는 main4.js와는 달리 함수를 사용해 코드를 줄였다.
// 추가적으로 pm2와 관련한 주석이 포함되어 있으며
// create 라는 페이지를 따로 만들어 정보를 저장하는 방법을 설명하고 있다.

// + ) pm2를 설치해서 무중단 서비스를 진행 할 수 있다.
// npm install pm2 -g
//pm start action.js를 통해 열람 가능하다.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// + ) create 라는 게시창을 하나 만든다.
function TemplateHTML (title,list,body) {
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
    <a href="/create">create</a>
    ${body}
  </body>
  </html>`
}

// + ) create를 누르면, create.html의 내용을 불러 TemplateList에 실행한다.
// 그결과로 <form>을 불러올 수 있다.
function create(addr) {
  return fs.readFileSync(addr,'utf8');
}

function TemplateList(filelist) {
  var list = '<ul>';
  for (var i = 0; i < filelist.length; i++)  {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
  }
  list +=  '</ul>';
  return list;
}

// request : 요청할 때 웹이 보낸 정보
// response : 응답할 때 웹으로 보낼 정보
var app = http.createServer(function(request,response){


    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var queryPath = url.parse(_url, true).pathname;
    if(queryPath === '/'){
      if(queryData.id === undefined){
         fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var data = 'Hello Node.js';
          var list = TemplateList(filelist);
          var template = TemplateHTML(title, list, `<h2>${title}</h2><p>${data}</p>`);
          response.writeHead(200);
          response.end(template); })
       } else {
         fs.readdir('./data', function(error, filelist){
           var title = queryData.id;
           var list = TemplateList(filelist);
           fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data) {
           var template = TemplateHTML(title, list, `<h2>${title}</h2><p>${data}</p>`);
           response.writeHead(200);
           response.end(template);
           });
         });
       }
       // + ) '/' 즉, 홈으로 접속하지 않았을 경우에는 404로 이동하기 때문에
       // queryPath가 /create일 때를 대비해 조건문을 하나 생성하였다.
     } else if(queryPath === '/create') {
       fs.readdir('./data', function(error, filelist){
        var title = 'create';
        var list = TemplateList(filelist);
        var template = TemplateHTML(title, list,create('./create/create.html'));
        response.writeHead(200);
        response.end(template); })

     // + ) create의 submit을 누르면 /create_process의 주소로 이동하게 되고
     // 해당 웹 페이지를 이 곳에서 표시한다.
     } else if(queryPath === '/create_process') {
       // body는 전체 데이터이다.
       var body = '';
       //  + ) createServer function의 parameta인 request를 사용해서
       // post방식으로 제출한 데이터를 넘긴다.
       request.on('data',function(data){
         //  + ) 서버에 data를 보낼 때 Sliding Windows방식으로 보내기 때문에
         // 전체 데이터에 windows를 쌓아 넣는 형식으로 작성한다.
         body = body + data;
       });
       // + ) 전송될 데이터가 더이상 없으면 이 부분이 실행된다.
       request.on('end',function(){
          // + ) qs.parse(body)를 통해  post형식으로 데이터를 생성한다.
          // { title: 'ex', description: 'ex' }
          var post = qs.parse(body);
          var title = post.title;
          var data = post.description;
          // + ) writeFile(저장할파일 위치와 이름, 파일 내용, [옵션], callback)
          fs.writeFile(`data/${title}`,data,'utf8',function(err){
            // + ) 302 : page redirection
            // writeHead(302,{Location:location})을 통해 리다이렉션을 한다.
            // data 밑에 파일을 생성한 후, id가 post.title인 페이지로 이동하는 데
            // 이 때, 63번 째 줄의 수행경로에 따라 페이지를 생성한다.
            response.writeHead(302,{Location:`/?id=${title}`});
            response.end();
          })
       })
     }
     else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
