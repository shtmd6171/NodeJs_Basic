var M = {
  v:"V",
  f:function() {console.log(this.v)}
}

// M의 객체 내부를 사용할 수 있도록 모듈내로 전송한다.
module.exports = M;
