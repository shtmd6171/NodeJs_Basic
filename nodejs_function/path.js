var path = require('path');

/*
{
  root: '',
  dir: '../lib',
  base: 'password.js',
  ext: '.js',
  name: 'password'
}
*/
console.log(path.parse('../lib/password.js'));

// base 정보만을 출력해 실제 경로를 감출 수 있다.
console.log(path.parse('../lib/password.js').base);
