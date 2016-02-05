var feed_url = null ;
//show rss message
$('body').on('click', '.use-link', function() {
    feed_url = $(this).parent().prev('td').text();
    console.log(feed_url);
    getNews();
});
//show input for rss
$("#add").click(function() {
    $(".enter-link").toggle("slow");
});
//add new rss link
$(".new-link").click(function() {
    var newRss = $(".input-link").val();
    console.log(newRss);
    getRss(newRss);
});
//show rss chanell fedd
$('body').on('click', '.glyphicon-stats', function() {
    if (!$(this).parent().hasClass('clicked')) {
        var stats_url = $(this).parent().parent().find('.rss-link').text();
        var td_stats = $(this).parent();
        getStats(stats_url, td_stats);
        $(this).parent().addClass('clicked');
    }
});
//function for get rss from link using google api
function getNews() {
    $.ajax({
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(feed_url),
        dataType: 'json',
        success: function(data) {
            console.log(data);
            $('#feed').empty();
            if (data.responseData.feed && data.responseData.feed.entries) {
                $.each(data.responseData.feed.entries, function(i, e) {
                    console.log(e);
                    var content = $('<li></li>').html("<span>" + e.publishedDate + "</span>" + "<br>" + "<span class='title'>" + "<a class='news-message'>" + e.title + "</a>" + "</span>" + "<br>" + "<a href='" + e.link + "' target='_blank'>Read More</a>");
                    $('#feed').append(content);
                
                });
            }
        }
    });
}
//get rss data 
function getRss(newRss) {
    $.ajax({
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(newRss),
        dataType: 'json',
        success: function(data) {
            console.log(data);
            if (data.responseData) {
                $(".table tbody").append("<tr>" + "<td>" + data.responseData.feed.title + "</td>" + "<td class='rss-link'>" + data.responseData.feed.feedUrl + "</td>" + "<td><a href='#' class='use-link'>USE</a></td>" + "<td><span class='glyphicon glyphicon-remove'></span></td>" + "<td> <span class='glyphicon glyphicon-pencil'></span></td>" + "<td><span class='glyphicon glyphicon-stats'></span></td>" + "</tr>");
                $(".input-link").val(null );
                $(".enter-link").hide("slow");
            } 
            else {
                alert(data.responseDetails);
            }
        }
    });
}
//get rss stats
function getStats(stats_url, td_stats) {
    console.log(stats_url);
    $.ajax({
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(stats_url),
        dataType: 'json',
        success: function(data) {
            console.log(data);
            if (data.responseData) {
                var e = data.responseData.feed;
                var msgC = e.entries.length;
                var authorC = 0;
                console.log(msgC);
                $.each(data.responseData.feed.entries, function(i, e) {
                    if (e.author) {
                        authorC++;
                    }
                });
                var statInfo = $('<div class="stats-info"></div>').html("<span>Message:" + msgC + "</span>" + "<span>Author:" + authorC + "</span>");
                $(td_stats).append(statInfo);
            }
        }
    });
}
//remove tr with rss data
$('body').on('click', '.glyphicon-remove', function() {
    var par = $(this).parent().parent();
    DeleteRow(par);
});
//change rss data
$('body').on('click', '.glyphicon-pencil', function() {
    var par = $(this).parent().parent();
    Edit(par);
});
//save rss change
$('body').on('click', '.glyphicon-download-alt', function() {
    var par = $(this).parent().parent();
    Save(par);
});
//get message text
$('body').on('click', '.news-message', function() {
    var msg_text = $(this).text();
    console.log(msg_text);
    getMsgStats(msg_text);
});
//get rss stats for diagram 
function getMsgStats(text) {
    var lowText = text.toLowerCase();
    console.log(lowText);
    var text_len = lowText.length
    var result = lowText.match(/[a-z]/g);
    console.log(result);
    console.log(text_len);
    if (result == null ) {
        $('.chart').data('easyPieChart').update(0);
        $('span', $('.chart')).text(0);
    } 
    else {
        var percent = Math.round(result.length * 100 / text_len);
        $('.chart').data('easyPieChart').update(percent);
        $('span', $('.chart')).text(percent);
    }
}
//delete rss row function
function DeleteRow(row) {
    row.remove();
}
//save rss function
function Save(par) {
    
    var title = par.children("td:nth-child(1)");
    var url = par.children("td:nth-child(2)");
    var tdUse = par.children("td:nth-child(3)");
    var tdDelete = par.children("td:nth-child(4)");
    var tdChange = par.children("td:nth-child(5)");
    title.html(title.children("input[type=text]").val());
    url.html(url.children("input[type=text]").val());
    tdUse.html("<a href='#' class='use-link'>USE</a>")
    tdDelete.html("<span class='glyphicon glyphicon-remove'></span>");
    tdChange.html("<span class='glyphicon glyphicon-pencil'></span>");
}
//edit rss function
function Edit(par) {
    
    var title = par.children("td:nth-child(1)");
    var url = par.children("td:nth-child(2)");
    var tdUse = par.children("td:nth-child(3)");
    var tdDelete = par.children("td:nth-child(4)");
    var tdChange = par.children("td:nth-child(5)");
    title.html("<input type='text' value='" + title.html() + "'/>");
    url.html("<input type='text' value='" + url.html() + "'/>");
    tdUse.html("<input type='text' value='" + tdUse.html() + "'/>");
    tdDelete.html("<span class='glyphicon glyphicon-remove'></span>");
    tdChange.html("<span class='glyphicon glyphicon-download-alt'></span>");

}
