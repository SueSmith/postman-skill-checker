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
  app.get("/customer", function(req, res) {
    if(!req.query.id) {
      return res.send({"status": "error", "message": "no id"});
    } else {
      let responseData = new Object();
      responseData['name']='Mary Smith';
      responseData['type']='Individual';
      return res.send(responseData);
    }
  });  
  
  //get all users
  app.get("/customers", function(req, res) {
      let responseData = new Array();
      let indivCust = new Object();
      indivCust['name']='Mary Smith';
      indivCust['type']='Individual';
      responseData[0]=indivCust;
      let compCust=new Object();
      compCust['name']='John Jones';
      compCust['type']='Company'
      responseData[1]=compCust;
      return res.send(responseData);
  });
  
  //add new user
  app.post("/customer", function(req, res) {
    if(!req.body.username) {
      return res.send({"status": "error", "message": "no username"});
    } else if(!req.body.data) {
      return res.send({"status": "error", "message": "no data"});
    } else {
      let 
      return res.send(JSON.stringify(req.body));
    }
  });
  
  //update user
  app.patch("/customer", function(req, res) {
    if(!req.body.username) {
      return res.send({"status": "error", "message": "no username"});
    } else if(!req.body.data) {
      return res.send({"status": "error", "message": "no data"});
    } else {
      return res.send(JSON.stringify(req.body));
    }
  });
};
 
module.exports = routes;