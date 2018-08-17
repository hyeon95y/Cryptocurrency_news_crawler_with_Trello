var fs = require('fs');


// 0. conlist(csv) 읽음
var path = require('path');
var filePath = path.join(__dirname, 'Coinlist.csv');

var data = fs.readFileSync(filePath, {encoding: "utf8"});
var rows = data.split("\n");
var numberOfCoins = rows.length-2; // csv 마지막 row 비어있는데 \n은 들어있음

var csv = [];
for (i=0; i<rows.length; i++){
  csv[i] = rows[i].split(",");
} // for문 돌릴때 index는 +1 ~ numberOfCoins 까지!


// 1. 첫 실행시 폴더가 있는지 체크하고 없으면 생성
if(!fs.existsSync(__dirname + '/localdata')){
  var mkdirp = require('mkdirp'); // 폴더 생성
  mkdirp('./localdata', function(err){
    if(err){
      console.log('Failed to create Folder');
    }
  });
}

// 2. 첫 실행시 txt가 있는지 체크하고 없으면 생성
for(i=1; i<rows.length; i++)
{
  var txtPath = __dirname + '/localdata/' + csv[i][1] + '.txt';
  if(!fs.existsSync(txtPath)){
    //console.log('File Not Found : ' + csv[i][1] + '.txt');
    fs.writeFileSync(txtPath, '\ufeff', {encoding: 'utf8'}); // .txt 생성
  }
  else {
    //console.log('Fild Already Exists : ' + csv[i][1] + '.txt');
  }

}
