// writeFile(저장할파일 위치와 이름, 파일 내용, [옵션], callback)
var fs = require('fs');
var data = "hello world";
fs.writeFile(`sample2.txt`,data,'utf8',(err) =>{

});
