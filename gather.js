var http = require('http');
var jsdom = require("jsdom");
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Q = require('q');
var BufferHelper = require('bufferhelper');
var bufferHelper = new BufferHelper();
var Iconv = require('iconv').Iconv;
var uuid = require('node-uuid');

module.exports = function (url, callback) {
    return getAllNewsLink(url)
        .then(function (data) {
           console.log(JSON.stringify(data));
            return JSON.stringify(data);
        }).done(function(data){
            callback(data);
        });
};

function getAllNewsLink(url) {
    var deferred = Q.defer();
    var allNewsLink = [];
    http.get(url, function (resp) {
        resp.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });

        resp.on('end', function () {
            var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
            var utf8_buffer = gbk_to_utf8_iconv.convert(bufferHelper.toBuffer());
            var htmls = utf8_buffer.toString();

            jsdom.env(htmls, ["http://code.jquery.com/jquery.js"], function (error, window) {
                if (error) {
                    deferred.reject(error);
                } else {
                    var $ = window.$;

                    $("div.ns-mr60 a").each(function () {
                        allNewsLink.push({"id": uuid.v4(), "title": $(this).html(), "link": $(this).attr("href")});
                    });

                    deferred.resolve(allNewsLink);
                }
            });
        });
    });

    return deferred.promise;
}

//function analyzeNewsUrl(newsUrl) {
//    var deferred = Q.defer();
//
//    var item = {
//        id: uuid.v4(),
//        url: newsUrl,
//        title: "",
//        contents: []
//    };
//
//    http.get(newsUrl, function (resp) {
//        resp.on('data', function (chunk) {
//            bufferHelper.concat(chunk);
//        });
//
//        resp.on('end', function () {
//            var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
//            var utf8_buffer = gbk_to_utf8_iconv.convert(bufferHelper.toBuffer());
//            var htmls = utf8_buffer.toString();
//
//            jsdom.env(htmls, ["http://code.jquery.com/jquery.js"], function (error, window) {
//                var $ = window.$;
//
//                item.title = $("#h1title").html();
//
//                var content = {
//                    p: [],
//                    image: []
//                };
//
//                $("#endText p").each(function () {
//                    content.p.push($(this).html());
//                });
//
//                item.contents.push(content);
//                deferred.resolve(item);
//            });
//        });
//    });
//
//    return deferred.promise;
//}