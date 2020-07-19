
var http = require('http');
var fs = require('fs');
var url = require('url');

function TemplateHTML (title,list,body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>`
}

function TemplateList(filelist) {
  var list = '<ul>';
  for (var i = 0; i < filelist.length; i++)  {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
  }
  list +=  '</ul>';
  return list;
}

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
     } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
