// function shuffle(array) {
//     var currentIndex = array.length, temporaryValue, randomIndex;
//
//     while (currentIndex !== 0) {
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }
//
//     return array;
// }

var cards = [
    "fa-diamond","fa-diamond",
    "fa-paper-plane-o","fa-paper-plane-o",
    "fa-anchor","fa-anchor",
    "fa-bolt","fa-bolt",
    "fa-cube","fa-cube",
    "fa-leaf","fa-leaf",
    "fa-bicycle","fa-bicycle",
    "fa-bomb","fa-bomb"
];

//还有一个比上边更简练的方式，如下
//随机排序函数，返回-1或1 ，然后用sort随机排列
function shuffle() {
    return Math.random()>0.5 ? -1 : 1;
}

var time = 0;
var t;
$(function() {
    cards.sort(shuffle); //实现随机洗牌
    $("ul").one("click",function clock(){ // 点击操作开始，实现计时器
        $("span.clock").html(time);
        time++;
        t = setTimeout(function(){
            clock();
            },1000);
    });
    $(".card").each(function(index) {
        var pattern = cards.pop(); //吐出一个 class
        $(this).find(".fa").addClass(pattern); //对应的每个 .fa 都增加各自的 class
        $(this).data("pattern",pattern); //存储起来，便于在翻出 2 个箱子时查看是否相等
        $(this).click(selectCard);

    });
});

function selectCard() {
    // $(this).one("click",clock());
    $fcard = $(".open"); // jQuery 里的DOM会存储在数组中
    if($fcard.length > 1) {  //翻了两张牌后退出翻牌
        return;
    }
    $(this).addClass("open show"); //实现翻牌效果
    $fcards = $(".open"); //再次存储数组，用来判断是否进行了 2 次点击
    if($fcards.length == 2) { //检查 2 次点击是否匹配
        setTimeout(function() {
            checkPattern($fcards);
        },700);
    }
    $(this).off('click'); //被翻开的牌不能再点击
}

var moves = 0;
function checkPattern(cards) {

    moves++;
    $("span.moves").html(moves); // 在页面中显示点击次数
    if(moves===13 || moves===18){ // 超过一定步数，减少星星等级
        $("ul.stars").children().eq(0).remove();
    }

    var pattern1 = $(cards[0]).data("pattern");
    var pattern2 = $(cards[1]).data("pattern");

    $(cards).shake(2, 10, 400);
    $(cards).removeClass("open show"); // 不匹配就重新盖上，且抖动一下
    $(cards).on('click', selectCard); // 重新增加监听事件

    if(pattern1==pattern2) {
        $(cards).addClass("match");
        $(cards).unbind("click");
        $(cards).css("opacity","0");
    }

    if(checkisWin() == 16){
        setTimeout(function(){ // 赢后对页面内容进行替换
            clearTimeout(t);
            $stars = $("ul.stars").length;
            $(".deck").replaceWith(
                "<div class='end'><h2>Congratulations ! You won ! </h2> " +
                "<p>With " + moves + " moves ! and " + $stars + " Stars in " + (time-1) + " seconds</p>" +
                "<div class='again'> Play again </div></div>"
            );
            $(".again").click(function() {
                window.location.reload();
            });
        },800);
    }
}


function checkisWin(){
  var i = 0;
  $(".card").each(function() {
      if($(this).hasClass("match")){
        i+=1;
      }
  });
  return i;
}

$(".restart").click(function() {
    window.location.reload();
});

//抖动效果实现代码
jQuery.fn.shake = function (intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
    this.each(function () {
        var jqNode = $(this);
        jqNode.css({ position: 'relative' });
        for (var x = 1; x <= intShakes; x++) {
            jqNode.animate({ left: (intDistance * -1) }, (((intDuration / intShakes) / 4)))
            .animate({ left: intDistance }, ((intDuration / intShakes) / 2))
            .animate({ left: 0 }, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
};
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
