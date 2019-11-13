var xml = require("xml");

var routes = function(app) {
//
// This route processes GET requests, by using the `get()` method in express, and we're looking for them on
// the root of the application (in this case that's https://rest-api.glitch.me/), since we've
// specified `"/"`.  For any GET request received at "/", we're sending some HTML back and logging the
// request to the console. The HTML you see in the browser is what `res.send()` is sending back.
//
  app.get("/", function(req, res) {
    res.send("<h1>REST API</h1><p>Oh, hi! There's not much to see here - view the code instead</p>"+
             "<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div>");
    console.log("Received GET");
  });
  
  //get request with query param
  app.get("/user", function(req, res) {
    
    console.log("Received GET: "+JSON.stringify(req.query));
    if(!req.query.id) {
      return res.send({"status": "error", "message": "no id"});
    } else {
      let responseData = new Object();
      responseData['title']='Your API request';
      responseData['message']='You sent a request to the API! '+
        'You asked the /user endpoint for the following query parameters: '+JSON.stringify(req.query);
      return res.send(responseData);
    }
  });  
  
  //endpoint to return xml
  app.get("/users", function(req, res) {
      let responseData = new Array();
      let item = new Object();
      item['title']='Your API request';
      item['message']='You sent a request to the API! '+
        'You asked for the /users endpoint';
      responseData[0]=item;
      return res.send(responseData);
  });
  
  app.post("/user", function(req, res) {
    var dummyData = {
      "username": "testUser",
      "data": "1234"
    };
    console.log("Received GET: "+JSON.stringify(req.body));
    if(!req.query.username) {
      return res.send({"status": "error", "message": "no username"});
    } else if(!req.query.data) {
      return res.send({"status": "error", "message": "no data"});
    } else if(req.query.username != dummyData.username) {
      return res.send({"status": "error", "message": "username does not match"});
    } else {
      return res.send(dummyData);
    }
  });
  
  app.patch("/update", function(req, res) {
    var dummyData = {
      "username": "testUser",
      "data": "1234"
    };
    console.log("Received GET: "+JSON.stringify(req.body));
    if(!req.query.username) {
      return res.send({"status": "error", "message": "no username"});
    } else if(!req.query.data) {
      return res.send({"status": "error", "message": "no data"});
    } else if(req.query.username != dummyData.username) {
      return res.send({"status": "error", "message": "username does not match"});
    } else {
      return res.send(dummyData);
    }
  });
};
 
module.exports = routes;