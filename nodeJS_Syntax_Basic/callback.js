// 익명함수(람다식)
var a = function() {
  console.log('A');
}
a();

// parameta인 callback은 a를 가리킨다.
// fileread.js에서의 callback 함수도 마찬가지로 value 형태로 저장하고
// 해당 value를 11구문의 callback() 형태로 실행시키는 것이다.
function slowfunc(callback) {
  callback();
}

slowfunc(a);
