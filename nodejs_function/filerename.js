var fs = require("fs");

fs.rename('./sampe2.txt','./sample_2.txt',(err) => {
  var data = "hello world!";
  fs.writeFile(`sample2.txt`,data,'utf8',(err) =>{

  });
})
