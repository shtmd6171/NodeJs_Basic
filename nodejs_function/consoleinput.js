var args = process.argv;
/* ['C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\NO\\Desktop\\nodejs\\first_nodejs\\consoleinput.js',
  '이 내용은 콘솔에서 실행됐습니다'
]
 args는 위와 같은 배열 값을 가지고 있고, 콘솔 내부에서 입력한 값을 실행하기 위해서는
 args[2]의 부분부터 이용하면 된다.
*/
console.log(args); // 배열 전체를 불러온다.
console.log(args[2]); // output 이 내용은 콘솔에서 실행됐습니다.

//이를 이용해서 console 내부의 입력을 통해 JS파일을 동작 시킬 수 있다.
if(args[2] === '1'){
  console.log("1을 입력함");
} else {
  console.log("다른 값을 입력함");
}
