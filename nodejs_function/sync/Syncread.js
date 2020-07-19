var fs = require('fs');

//readFileSync
console.log("내용 시작");
var result = fs.readFileSync('../../nodejs_function/sample.txt', 'utf8')
console.log(result);
console.log("내용 끝");


//readFile
console.log("내용 시작");
//readFile은 return 대신 callback 함수를 사용한다.
// 순서를 기다리지 않고 출력 가능한 문구를 먼저 출력한다.
fs.readFile('../../nodejs_function/sample.txt', 'utf8', function(error, data){
  if(!error)  console.log(data);

})
console.log("내용 끝");
