// Trello node.js API link (package trello)
// https://www.npmjs.com/package/trello

var Trello = require("trello");
key1 = ''
key2 = ''
var trello = new Trello(key1, key2);


// 하나의 링크가 하나의 보드고, 그 안에 있는게 리ㅡ크와 카드
// 보드의 id는 링크에 있음

// 1. How to get Id of List?
var cardsPromise = trello.getListsOnBoard('6v3k6vjZ');
//cardsPromise.then((data)=> {
//  console.log(data[0].name); //data[0].id 로 attr 접근가능
//});

// 2. Coinlist.csv의 코인명들이 존재하는지 확인, 없다면 List생성
  //temp_txt_manager.js에서 긁어온 코드 / 시작
  var fs = require('fs');
  var path = require('path');
  var filePath = path.join(__dirname, 'Coinlist.csv');
  var data = fs.readFileSync(filePath, {encoding: "utf8"});
  var rows = data.split("\n");
  var numberOfCoins = rows.length-2; // csv 마지막 row 비어있는데 \n은 들어있음
  var csv = [];
  for (i=0; i<rows.length; i++){
    csv[i] = rows[i].split(",");
  } // for문 돌릴때 index는 +1 ~ numberOfCoins 까지!
  //temp_txt_manager.js에서 긁어온 코드 / 끝
var nameArray = [];
var idArray = [];
cardsPromise.then((data)=> { // 비동기성 때문이지? Trello 관련한 코드 모두 이 스코프 안에서 처리해야함
  //console.log(data);
  var cardPromise = trello.getCardsOnList('5a2e5fd4580eb22dac8c9330');
  cardPromise.then((cards) => {
    console.log(cards);
  })

/*
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
    */
});






/*
// 2. How to add Card?
trello.addCard('Clean car', 'Wax on, wax off', '5a2e5fd4580eb22dac8c9330',
    function (error, trelloCard) {
        if (error) {
            console.log('Could not add card:', error);
        }
        else {
            console.log('Added card:', trelloCard);
        }
    });
    */
