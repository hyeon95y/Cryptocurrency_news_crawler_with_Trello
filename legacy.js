// 파일 접근에 쓰임
var fs = require('fs');
// 트위터 크롤링에 쓰임
var request = require("request");
var cheerio = require("cheerio");

// ** main.js

// 0. Coinlist.csv 읽음
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
//    Sync / ASync 문제로 폴더가 없을때 제대로 동작하지 않음
//    txt생성은 제대로 동작하기에 폴더는 수동으로 생성해주고 해당 기능 삭제함

// 2. 첫 실행시 txt가 있는지 체크하고 없으면 생성
for(i=1; i<rows.length; i++)
{
  var txtPath = __dirname + '/localdata/' + csv[i][1] + '.txt';
  //if(!fs.existsSync(txtPath)){
  //  //console.log('File Not Found : ' + csv[i][1] + '.txt');
  //  fs.writeFileSync(txtPath, '\ufeff', {encoding: 'utf8'}); // .txt 생성
  //}
  (function(txt){
    fs.exists(txtPath, function(exists){
      if(exists == false){
        fs.writeFileSync(txt, '\ufeff', {encoding: 'utf8'}); // .txt 생성
      }
    });
  })(txtPath);

  //else {
  //  //console.log('Fild Already Exists : ' + csv[i][1] + '.txt');
  //}

}

// 3. Trello에서 List들의 목록을 받아오고
//    Coinlist.csv에 없는 코인은 새로 리스트 생성 + id, name을 새로 생성한 1차원 배열에 저장(indexOf로 빠르게 접근할수 있기 위해)
var Trello = require("trello");
key1 = ''
key2 = ''
var trello = new Trello(key1, key2);
var cardsPromise = trello.getListsOnBoard('6v3k6vjZ');
var nameArray = [];
var idArray = [];
cardsPromise.then((data)=> { // 비동기성 때문인지? Trello 관련한 코드 모두 이 스코프 안에서 처리해야함

    for(i=0; i<data.length; i++) // 배열 탐색(indexOf) 사용을 위해 nameArray[] 생성하고 name만 복사+
    {
      (function(m){ // 자바스크립트의 closure-for 이슈로 인한 익명함수
        nameArray[m] = data[m].name;
        idArray[m] = data[m].id;
        //console.log(nameArray[i]);
      })(i);
    }

    for(j=1; j<numberOfCoins; j++) // Coinlist.csv로 부터 해당 리스트 있는지 검색
    {
      (function(m){ // 자바스크립트의 closure-for 이슈로 인한 익명함수
        if(nameArray.indexOf(csv[m][1]) == -1)
        {
          trello.addListToBoard('6v3k6vjZ', csv[m][1], function(error, trelloList){
            if (error) {
                console.log('Could not add list:', error);
            }
            else {
                console.log('Added list:', trelloList);
                nameArray.push(trelloList.name);
                idArray.push(trelloList.id);
            }
          });
        }
        else {
          console.log('List already exist! : ' + csv[m][1]);
        }
      })(j);
    }


// 4. Twitter 크롤링 후 txt파일과 대조해가면서 없는 내용 저장
//    비동기성 때문에 아직 3. 의 cardPromise 스코프 안에 들어와있음
    for(j=1; j<numberOfCoins; j++)
    {
      (function(m){ // 자바스크립트의 closure-for 이슈로 인한 익명함수
        if(csv[m][3] !== ''){
          console.log(csv[m][1] + '의 트위터 링크1 존재');
          console.log(csv[m][3]);
          getTwitterData(csv[m][3], m);
        }
        if(csv[m][4] !== ''){
          console.log(csv[m][1] + '의 트위터 링크2 존재');
          console.log(csv[m][4]);
          getTwitterData(csv[m][4], m);
        }
        if(csv[m][5] !== ''){
          console.log(csv[m][1] + '의 트위터 링크3 존재');
          console.log(csv[m][5]);
          getTwitterData(csv[m][5], m);
        }
        if(csv[m][6] !== ''){
          console.log(csv[m][1] + '의 트위터 링크4 존재');
          console.log(csv[m][6]);
          getTwitterData(csv[m][6], m);
        }
        // csv의 마지막 column에 ''도 아니고 '/ㅜㅜn'도 아닌 이상한것이 들어가있어 처리가 불가능했음
        // 그래서 비어있는 '가상화폐'의 트위터링크5와 비교
        // '가상화폐'의 위치를 122로 유지해야함
        if(csv[m][7] !== csv[122][7]){ // 122는 '가상화폐'가 들어가있는 column
          console.log(csv[m][1] + '의 트위터 링크5 존재');
          console.log(csv[m][7]);
          getTwitterData(csv[m][7], m);
        }


      })(j);
    }



// ?. Trello 업로드
//    트위터뿐만 아니라 후에 공용으로 쓰일 내용임
//    마찬가지로 Sync때문에 3.의 Scope 안에서 처리해야함




console.log('loop finished');
}); // 3. 의 cardPromise scope가 끝나는 지점















// ** Functions

// 4. Twitter 크롤링에 쓰이는 functions

//var url = "https://twitter.com/Ripple";
//getTwitterData(url, 2);

// twitter url을 받고 크롤링 결과를 뱉음
function getTwitterData(url, coinIndex){
  request(url, function(error, response, body){
    if(error) throw error;

    // txt 읽음
    //var txtForTwitter = fs.readFileSync(__dirname + "/localdata/"+csv[coinIndex][1]+".txt", {encoding: 'utf8'}));
    var txtForTwitter = fs.readFile(__dirname + "/localdata/"+csv[coinIndex][1]+".txt", {encoding:'utf8'}, function(err, data){

   //console.log(data);
   if(err) throw err;
   var lineArray = data.toString().split('\n');


   var $ = cheerio.load(body);
   var text = $('div.tweet.js-stream-tweet').each(function(index, ele){
     var article = $(this).find('div.js-tweet-text-container > p').text();
     console.log(article);
     var time = parseTime($(this).find('.time').html());
     console.log(time);
     var link = 'https://twitter.com' + $(this).attr('data-permalink-path');
     console.log(link);
     var twitterName = $(this).find('span.FullNameGroup > strong').html();
     console.log(twitterName);

     var textToAdd = article + ',' + time + ',' + link + ',Twitter:' + twitterName + ',n,'+'\n';
     if(lineArray.indexOf(textToAdd) == '-1'){
       lineArray.push(textToAdd);
     }
   });
   // txt 작성
   var textToWriteForTwitter = '';
   for(i=0; i<lineArray.length; i++){
     (function(m){
         textToWriteForTwitter += lineArray[m];
     })(i);
   }
   fs.writeFile(__dirname + "/localdata/"+csv[coinIndex][1]+".txt", '\ufeff' + textToWriteForTwitter, {encoding: 'utf8'}, function(err, data){
     if(err) throw err;
   });
 });


});

}
// targetstr 앞의 문자열을 반환함
function cutBefore(str, targetstr){
  return str.substr(0, str.indexOf(targetstr));
}
// targetstr 뒤의 문자열을 반환함
function cutAfter(str, targetstr){
  return str.substr(str.indexOf(targetstr)+targetstr.length, str.length);
}
// html로 나오고 DOM 파싱 안되는 시간을 직접 파싱해줌
function parseTime(html){
  html = cutAfter(html, 'title="');
  html = cutBefore(html, '"');
  html = html.replace('&#xB144', '년').replace('&#xC6D4', '월').replace('&#xC77C', '일');
  html = html.replace('&#xC624;&#xC804;', '오전').replace('&#xC624;&#xD6C4;', '오후');
  html = html.replace(/;/gi, ''); // /문자열/gi 하면 replaceAll과 같은 효과를 낼수있음
  return html;
}
