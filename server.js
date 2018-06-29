var express = require('express');
var bodyParser = require('body-parser');
var logger=require("morgan");
var mongoose = require('mongoose');
var axios=require("axios");
var cheerio=require("cheerio");
var db=require("./models");

var PORT=3000;

var app=express();


app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/scrape", function(req, res) {
	
	axios.get("https://www.cnn.com/").then(function(response) {
	  var $ = cheerio.load(response.data);
	  $("article h2").each(function(i, element) {
		var result = {};
		result.title = $(this)
		  .children("a")
		  .text();
		result.link = $(this)
		  .children("a")
		  .attr("href");
		db.Murial.create(result)
		  .then(function(dbMurial) {
			
		  })
		  .catch(function(err) {
			
			return res.json(err);
		  });
	  });
	  
	   res.json(response);
	});
  });
 
app.get("/articles", function(req, res) {
  
  return(function(dbMurial) {
      
      res.json("response");
    })
    (function(err) {
      
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  // db.Murial.findOne({ _id: req.params.id })
    populate("note")
    return(function(dbMurial) {
      res.json(dbMurial);
    })
    (function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

  