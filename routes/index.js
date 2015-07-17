var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var gather = require('../gather');
/* GET home page. */
router.get('/', function (req, res, next) {
    gather("http://news.163.com", function(data){
        res.render('index', {title: '小邵新闻 xiaoshao news', news: data});
    });
});

router.get('/news/:id', function (req, resp, next) {
    resp.render('news', getNews(req.params.id));
});

function getNews(newsId) {
    var newsInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../news/20150717/163.json")));
    var news;

    console.log(newsId);
    for(var index = 0; index < newsInfo.length; index ++){
        console.log(newsInfo[index].id);
        if(newsInfo[index].id == newsId){
            news = newsInfo[index];
            break;
        }
    }

    console.log(JSON.stringify(news));
    return {
        "title": news.title,
        "url": news.link
    };
}

module.exports = router;
