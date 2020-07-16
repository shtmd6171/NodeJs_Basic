var fs = require('fs');
// 'utf8'은 옵션이고, 옵션을 지정하지 않으면 원시 버퍼 형태로 도출된다.
// readfile의 3번째 인자는 콜백함수다.
// 파일을 읽어내는 작업이 끝나면 콜백함수로 동작을 해서 이 함수를 통해 이 후 작업을 처리한다.
// 해당 모듈(require('fs'))의 도큐먼트는
// https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_fs_readfile_path_options_callback
fs.readFile('sample.txt', 'utf8', (err, data) => {
  console.log(data);
});
