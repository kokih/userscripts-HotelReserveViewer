// ==UserScript==
// @name         HotelReserveViewer
// @namespace    com.chuo.koki
// @version      1.1.0
// @description  Improve view of Hotel alpha-one reservation page.
// @author       Koki
// @match        https://alpha1-u.hotels-system.jp/yoyakusearchg.aspx
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.29.6/js/jquery.tablesorter.js
// ==/UserScript==

(function ($) {
    'use strict';

    // Your code here...
    alert('Hello, monkey!');

    // ========
    // 機能1: テーブルをソートできるようにする
    // ========

    // Table1 に予約情報が格納されている
    // 但し、tr 一つ目が <tr><th> とヘッダになっている。
    // tablesorter を機能させるには <thead> <tbody> が必要
    // tbody 内の１行目を、thead 内に移動
    var theadTag = $("<thead />");
    var trTag = $("table#Table1 tbody tr")[0];
    theadTag.append(trTag);
    $("#Table1").prepend(theadTag);
    var setStupidTable = function(){
        $('#Table1').tablesorter();
    };
    setTimeout(setStupidTable, 1500);

    // ========
    // 機能2: 予約先ホテル名ごとに、背景に色をつける
    // ========
    $("table#Table1 tbody tr").each(function(i, elem) {
        //console.log(elem);
        var targetTd = $(elem).find("td")[0];
        var hotelname = targetTd.innerText;
        if ( hotelname == "出雲" ) {
            $(targetTd).css('background-color','honeydew');
        } else if ( hotelname == "鯖江" ) {
            $(targetTd).css('background-color','lightcyan');
        }
    });

    // ========
    // 機能3: 禁煙・喫煙に背景色をつける
    // ========
    $("table#Table1 tbody tr").each(function(i, elem) {
        //console.log(elem);
        var targetTd = $(elem).find("td")[1];
        var smokableYN = targetTd.innerText;
        if ( smokableYN.match(/喫煙/) ) {
            $(targetTd).css('background-color','snow');
        } else if ( smokableYN.match(/禁煙/) ) {
            $(targetTd).css('background-color','azure');
        }
    });

})(jQuery);