var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var newsUrls = fs.readFileSync(path.join(__dirname, "../163/news"));
    res.render('index', {title: 'Express', news: JSON.parse(newsUrls.toString())})
});

router.get('/news', function (req, resp, next) {
    var newsId = req.query.newsId;
    console.log(newsId);
    resp.render('news', {news: getNews(newsId)});
});

function getNews(newsId) {
    return {
        "title": "this is news title",
        "contents": "content",
        "images": "images"
    }
}
module.exports = router;
