// ==UserScript==
// @name         HotelReserveViewer
// @namespace    com.chuo.koki
// @version      1.3.0.dev
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
    // 機能2: 予約先ホテル名ごとに、背景に色をつける ver 1.1.0
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
    // 機能3: 禁煙・喫煙に背景色をつける ver 1.1.0
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

    // ========
    // 機能4: キャンセル済みの予約の表示・非表示切替機能をつける ver 1.2.0
    // ========
    // 切替ボタンを追加
    var battonShowHideCanceledReservation = '<input type="button" style="margin-left:30px;" value="キャンセル：非表示" id="button_ShowHideCanceledReservation">';
    $("#tdShukuhakuRireki").append(battonShowHideCanceledReservation);
    $("input#button_ShowHideCanceledReservation").click(function(){
        if( this.value == "キャンセル：非表示" ){
            this.value = "キャンセルを表示する";
            $("table#Table1 tbody tr").each(function(i, elem) {
                var targetTd = $(elem).find("td")[5];
                var strIsCanceled = targetTd.innerText;
                if ( strIsCanceled.match(/キャンセル/) ) {
                    $(elem).css('display', 'none');
                }
            });
        } else {
            this.value = "キャンセル：非表示";
            TT_TsujoHyoji();
        }
    });

    // ========
    // 機能5: 室数分の行数で表示する(切替) 1.3.0.dev
    // ========
    var battonRoomNumRow = '<input type="button" style="margin-left:30px;" value="室数分行数" id="button_RoomNumRow">';
    $("#tdShukuhakuRireki").append(battonRoomNumRow);
    $("input#button_RoomNumRow").click(function(){
        if( this.value == "室数分行数" ){
            $("table#Table1 tbody tr").each(function(i, elem) {
                var targetTd3 = $(elem).find("td")[3];
                var targetTd4 = $(elem).find("td")[4]; // 部屋数
                var strRoomNum = targetTd4.innerText;
                var intRoomNum = parseInt(strRoomNum.replace("部屋", ""), 10);
                if ( intRoomNum > 1 ) {
                    // 行数を増やす処理

                    //// elem 内の対象となる td に rowspan を設定
                    //$(elem).find("td")[0].setAttribute("rowspan", intRoomNum); // ホテル名
                    //$(elem).find("td")[1].setAttribute("rowspan", intRoomNum); // 部屋タイプ
                    //$(elem).find("td")[2].setAttribute("rowspan", intRoomNum); // プラン名
                    // $(elem).find("td")[3].setAttribute("rowspan", intRoomNum); // 期間
                    //$(elem).find("td")[4].setAttribute("rowspan", intRoomNum); // 部屋数
                    // $(elem).find("td")[5].setAttribute("rowspan", intRoomNum); // 備考
                    //$(elem).find("td")[6].setAttribute("rowspan", intRoomNum); // 詳細
                    //// elem の直後に <tr /> を追加
                   // var newTr = $("<tr />");
                    //newTr.append($(elem).find("td")[3]);
                    //newTr.append($(elem).find("td")[5]);
                    //$(elem).after(newTr);
                }
            });
            this.value = "室数分行数：元に戻す";
        } else {
            TT_TsujoHyoji();
            $("input#button_ShowHideCanceledReservation").click(); // キャンセル表示をクリアしてしまうので、再度処理を施す
            this.value = "室数分行数";
        }
    });

    // ========
    // 機能6: 予約期間表示を横方向スケジュール式にする 1.3.0.dev
    // ========
    var battonHorizontalSchedule = '<input type="button" style="margin-left:30px;" value="横スケジュール" id="button_HorizontalSchedule">';
    $("#tdShukuhakuRireki").append(battonHorizontalSchedule);
    $("input#button_HorizontalSchedule").click(function(){
        if( this.value == "横スケジュール" ){
            $("table#Table1 tbody tr").each(function(i, elem) {

                // もし既に横スケジュール表示テーブルを追加しているのであれば、表示切替のみ

                // 横スケジュール表示テーブルが追加されていないのであれば、追加して表示

                var targetTd3 = $(elem).find("td")[3];
                //// 期間データを処理
                var strReserveDate = targetTd3.innerText; // 5/25 ～ 5/28（3泊)
                var strReserveStartDate =strReserveDate.split("～")[0].replace(" ","");
                var strReserveFinishDate = strReserveDate.split("～")[1].split("（")[0].replace(" ","");

                var reserveStartMonth = parseInt(strReserveDate.split("～")[0].split("/")[0].replace(" ",""), 10);
                var reserveStartDay = parseInt(strReserveDate.split("～")[0].split("/")[1].replace(" ",""), 10);
                var reserveFinishMonth = parseInt(strReserveDate.split("～")[1].split("/")[0].replace(" ",""), 10);
                var reserveFinishDay = parseInt(strReserveDate.split("～")[1].split("/")[1].replace(" ",""), 10);

                //// 期間のビジュアライズ
                var newTable = $("<table />");
                $(newTable).css("border", "0");
                var newTBody = $("<tbody />");
                //// 現在の月と翌月分のスケジュールを表示する
                var dt = new Date();
                var thisMonthLastDate = new Date(dt.getFullYear(), dt.getMonth() + 1, 0); // 現在の月の最終日
                var nextMonthLastDate = new Date(dt.getFullYear(), dt.getMonth() + 2, 0); // 翌月の最終日
                var thisMonth = dt.getMonth()+1; // 今日の月
                var thisDay = dt.getDate(); // 今日の日
                var nextMonth = dt.getMonth()+1; // 翌月
                var maxThisMonth = thisMonthLastDate.getDate(); // 今月の最終日
                var maxNextMonth = nextMonthLastDate.getDate(); // 翌月の最終日

                for ( var indexMonth = reserveStartMonth; indexMonth <= reserveFinishMonth; indexMonth++ ){
                    var dateTempIndexMonth = new Date(dt.getFullYear(), indexMonth, 0);
                    var indexMonthLastDate = dateTempIndexMonth.getDate();
                    for ( var index1 = 1; index1<= indexMonthLastDate; index1++ ){
                        var rowTd = $("<td></td>");
                        if ( index1 == reserveStartDay && indexMonth == reserveStartMonth ){
                            rowTd.append(strReserveStartDate);
                            $(rowTd).css("background-color", "orange");
                        } else if ( index1 == reserveFinishDay && indexMonth == reserveFinishMonth ){
                            rowTd.append(strReserveFinishDate);
                            $(rowTd).css("background-color", "green");
                        } else {
                            rowTd.append(" ");
                            $(rowTd).css("background-color", "gray");
                        }
                        newTBody.append(rowTd);
                    }
                }
                newTable.append(newTBody);

                $(targetTd3).empty();
                $(targetTd3).append(newTable);
            });
            this.value = "横スケジュール：元に戻す";
        } else {
            TT_TsujoHyoji();
            $("input#button_ShowHideCanceledReservation").click(); // キャンセル表示をクリアしてしまうので、再度処理を施す
            this.value = "横スケジュール";
        }
    });

    // ========
    // 機能7: 既存の「予約表示」ボタンを押下された時、追加したボタン類のうち初期化が必要なものを初期化する 1.3.0.dev
    // ========
    $("input[value='予約表示'").click(function(){
        $("input#button_ShowHideCanceledReservation").val("キャンセル：非表示");
        $("input#button_HorizontalSchedule").val("横スケジュール");
    });

})(jQuery);