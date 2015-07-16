var http = require('http');
var jsdom = require("jsdom");
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');
var Q = require('q');

var directory;

module.exports = function (url, dir) {
    getAllNewsLink()
        .then(_.partial(_.filter, _, function (newsLink) {
            return newsLink == "http://news.163.com/15/0715/20/AUJFJTGK0001124J.html";
            //return newsLink.indexOf(".htm") > -1;
        }))
        .then(function (links) {
            return Q.all(_.map(links, function (newsLink) {
                    return analyzeNewsUrl(newsLink);
                })
            )
        }).then(function (data) {
            fs.mkdirSync(path.join(__dirname, moment().format("YYYYMMDD")));
            fs.writeFileSync(path.join(__dirname, moment().format("YYYYMMDD"), "163.json"), JSON.stringify(data), {"encoding": "utf-8"});
        }).done(function () {
            console.log("all done");
        });
}();

function getAllNewsLink() {
    var deferred = Q.defer();
    var allNewsLink = [];
    jsdom.env({
        url: "http://news.163.com",
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (errors, window) {
            if (errors) {
                deferred.reject(errors);
            } else {
                var $ = window.$;

                $("div.ns-mr60 a").each(function () {
                    allNewsLink.push($(this).attr("href"));
                });

                deferred.resolve(allNewsLink);
            }
        }
    });

    return deferred.promise;
}

function analyzeNewsUrl(newsUrl) {
    var deferred = Q.defer();

    var item = {
        url: newsUrl,
        title: "",
        contents: []
    };

    jsdom.env({
        url: newsUrl,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (errors, window) {
            var $ = window.$;
            item.title = $("#h1title").html();

            //var content = {
            //    p: [],
            //    image: []
            //};
            //
            //$("#endText p").each(function () {
            //    console.log($(this).html());
            //    content.p.push($(this).html());
            //});
            //
            //$("#endText iframe").each(function () {
            //    if ($(this).attr(src)) {
            //        content.image.push($(this).attr(src));
            //    }
            //});

            //item.contents.push(content);

            deferred.resolve(item);
        }
    });

    return deferred.promise;
}