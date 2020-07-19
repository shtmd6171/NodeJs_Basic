// data 폴더 내용을 불러온다.
var testFolder = '../data/';
var fs = require('fs');

// 디렉토리의 목록을 배열 형식으로 불러오는 함수 readdir
fs.readdir(testFolder, function(error, filelist){
  console.log(filelist); // [ 'CSS', 'HTML', 'JavaScript' ]
})
