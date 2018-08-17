var request = require("request");
var cheerio = require("cheerio");

var url = "https://twitter.com/Ripple";

getTwitterData(url);

// twitter url을 받고 크롤링 결과를 뱉음
function getTwitterData(url){
  request(url, function(error, response, body){
    if(error) throw error;
    var $ = cheerio.load(body);
    var text = $('div.tweet.js-stream-tweet').each(function(index, ele){
      console.log('['+index+'] 번째 트윗');
      console.log($(this).find('span.FullNameGroup > strong').html());
      console.log($(this).find('div.js-tweet-text-container > p').text());
      console.log($(this).attr('data-permalink-path'));
      console.log(parseTime($(this).find('.time').html()));
      console.log();
    });
  });
  return;
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
