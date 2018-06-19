var request=require("request");
var cheerio=require("cheerio");
var express = require("express");
var mongojs = require("mongojs");

var app = express();


var databaseUrl = "scraper2";
var collections = ["Murial"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Murial Rocks!");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
    // Find all results from the Murial collection in the db
    db.Murial.find({}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.json(found);
      }
    });
  });
  

  app.get("/scrape", function(req, res) {
request('https://finance.yahoo.com/tech/', function(err, response, html){
	if (err) {
		throw err
    }
    var $ = cheerio.load(html);
    
    $(".title").each(function(i, element) {
      
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

      if (title && link) {
        
        db.Murial.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(inserted);
          }
        });
      }
    });
  });
  res.send("Scrape Complete");
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
