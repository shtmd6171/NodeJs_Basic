// module의 관한 내용을 기록한다.
// 객체 상위 타입, 라이브러리의 개념

// muse.js에서는 mpart.js내에서 생성한 module을 사용하기 위해
// require를 사용해 part의 변수에 M객체를 담았다.
// part = { v: 'V', f: [Function: f] }
var part = require('./mpart.js')
part.f(); // V
