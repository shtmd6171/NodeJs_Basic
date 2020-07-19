// main5.js ) 이 Js파일 내부에서는 main4.js와는 달리 함수를 사용해 코드를 줄였다.
// 추가적으로 pm2와 관련한 주석이 포함되어 있으며
// create 라는 페이지를 따로 만들어 정보를 저장하는 방법을 설명하고 있다.

// + )

// main5.js ) pm2를 설치해서 무중단 서비스를 진행 할 수 있다.
// npm install pm2 -g
//pm start action.js를 통해 열람 가능하다.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// main5.js ) create 라는 게시창을 하나 만든다.
// + ) update 웹기능을 추가하기 위해, create가 표시된 부분을
// control의 변수로 묶었다.
// 이 때, update은 root로 접속 했을 때는 출력이 안되게 설정한다.
function TemplateHTML (title, list, body, control) {
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
}

// main5.js ) create를 누르면, create.html의 내용을 불러 TemplateList에 실행한다.
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
          var template = TemplateHTML(title, list,
            `<h2>${title}</h2><p>${data}</p>`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(template); })
       } else {
         fs.readdir('./data', function(error, filelist){
           var title = queryData.id;
           var list = TemplateList(filelist);
           fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data) {
           var template = TemplateHTML(title, list,
             `<h2>${title}</h2><p>${data}</p>`,
           `<a href="/create">create</a>  <a href="/update?id=${title}">update</a>`);
           response.writeHead(200);
           response.end(template);
           });
         });
       }
       // main5.js ) '/' 즉, 홈으로 접속하지 않았을 경우에는 404로 이동하기 때문에
       // queryPath가 /create일 때를 대비해 조건문을 하나 생성하였다.
     } else if(queryPath === '/create') {
       fs.readdir('./data', function(error, filelist){
        var title = 'create';
        var list = TemplateList(filelist);
        var template = TemplateHTML(title, list,create('./create/create.html'),'');
        response.writeHead(200);
        response.end(template); })

     // main5.js ) create의 submit을 누르면 /create_process의 주소로 이동하게 되고
     // 해당 웹 페이지를 이 곳에서 표시한다.
     } else if(queryPath === '/create_process') {
       // body는 전체 데이터이다.
       var body = '';
       //  main5.js ) createServer function의 parameta인 request를 사용해서
       // post방식으로 제출한 데이터를 넘긴다.
       request.on('data',function(data){
         //  main5.js ) 서버에 data를 보낼 때 Sliding Windows방식으로 보내기 때문에
         // 전체 데이터에 windows를 쌓아 넣는 형식으로 작성한다.
         body = body + data;
       });
       // main5.js ) 전송될 데이터가 더이상 없으면 이 부분이 실행된다.
       request.on('end',function(){
          // main5.js ) qs.parse(body)를 통해  post형식으로 데이터를 생성한다.
          // { title: 'ex', description: 'ex' }
          var post = qs.parse(body);
          var title = post.title;
          var data = post.description;
          // main5.js ) writeFile(저장할파일 위치와 이름, 파일 내용, [옵션], callback)
          fs.writeFile(`data/${title}`,data,'utf8',function(err){
            // main5.js ) 302 : page redirection
            // writeHead(302,{Location:location})을 통해 리다이렉션을 한다.
            // data 밑에 파일을 생성한 후, id가 post.title인 페이지로 이동하는 데
            // 이 때, 63번 째 줄의 수행경로에 따라 페이지를 생성한다.
            response.writeHead(302,{Location:`/?id=${title}`});
            response.end();
          })
       })
     } else if(queryPath == '/update'){
       fs.readdir('./data', function(error, filelist){
         var title = queryData.id;
         var list = TemplateList(filelist);
         fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data) {
           // + ) hidden 타입을 추가해서 바꾸려는 현재 title 값을 고정시켜 놓는다
           // hidden 타입의 input을 추가하지 않을 경우 사용자가 title명을 변경하고자 할 때
           // 원래 파일의 title 값을 알수 없는 문제가 발생한다
         var template = TemplateHTML(title, list,
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
         response.end(template);
         });
       });
       // update를 통해 submit 진행시 update_process 페이지로 이동한다.
       // 이동 한 뒤에 id title data를 얻어와 파일 이름과 내용을 변경하고
       // 업데이트 했던 페이지로 리다이렉션한다.
     } else if(queryPath === '/update_process'){
       var body = '';
       request.on('data',function(data){
         body = body + data;
       });
       request.on('end',function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var data = post.description;
          // + )  fs.rename(olddirname, newdirname, callback)
          // id를 통해서 현재 파일 이름을 얻고
          // title을 통해서 title로 파일명을 변경한다.
          fs.rename(`data/${id}`,`data/${title}`,function(err){
            fs.writeFile(`data/${title}`,data,'utf8',function(err){
              response.writeHead(302,{Location:`/?id=${title}`});
              response.end();
            });
          });

        });
      }
     else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
