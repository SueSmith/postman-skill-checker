var xml = require("xml");

var routes = function(app) {
  //
  // This route processes GET requests, by using the `get()` method in express, and we're looking for them on
  // the root of the application (in this case that's https://rest-api.glitch.me/), since we've
  // specified `"/"`.  For any GET request received at "/", we're sending some HTML back and logging the
  // request to the console. The HTML you see in the browser is what `res.send()` is sending back.
  //
  app.get("/", function(req, res) {
    res.send(
      "<h1>REST API</h1><p>Oh, hi! There's not much to see here - view the code instead</p>" +
        '<script src="https://button.glitch.me/button.js" data-style="glitch"></script><div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>'
    );
    console.log("Received GET");
  });

  //get request with query param
  app.get("/customer", function(req, res) {
    if (!req.query.id) {
      return res.send({ status: "error", message: "no id" });
    } else {
      let responseData = new Object();
      responseData["id"] = 1;
      responseData["name"] = "Blanche Devereux";
      responseData["type"] = "Individual";
      return res.send(responseData);
    }
  });

  //get all users
  app.get("/customers", function(req, res) {
    let responseData = new Array();
    let indivCust = new Object();
    indivCust["id"] = 1;
    indivCust["name"] = "Blanche Devereux";
    indivCust["type"] = "Individual";
    responseData[0] = indivCust;
    let compCust = new Object();
    compCust["id"] = 2;
    compCust["name"] = "Shady Pines";
    compCust["type"] = "Company";
    responseData[1] = compCust;
    return res.send(responseData);
  });

  //add new user
  app.post("/customer", function(req, res) {
    if (!req.body.name) {
      return res.send({ status: "error", message: "no name" });
    } else if (!req.body.type) {
      return res.send({ status: "error", message: "no type" });
    } else {
      let confirmation = new Object();
      confirmation["status"] = "customer added";
      return res.send(confirmation);
    }
  });

  //update user
  app.patch("/customer", function(req, res) {
    if (!req.body.name) {
      return res.send({ status: "error", message: "no name" });
    } else if (!req.body.type) {
      return res.send({ status: "error", message: "no type" });
    } else {
      let confirmation = new Object();
      confirmation["status"] = "customer updated";
      return res.send(confirmation);
    }
  });

  //learn
  app.get("/info", function(req, res) {
    if (req.query.id)
      return res.send({
        message:
          "You sent a query string parameter! It indicates you want some data associated with an id of 1.",
        next:
          "Now try adding a path parameter. Enter /:category before /info in the address. "+
          "In Params, enter a value for the category row (e.g. 'hats' and click Send again."
      });
    else
      return res.send({
        message: "You sent a request!!!",
        next:
          "Now try a parameter  - add ?id=1 to the end of the address after /info and click Send again."
      });
  });
  app.get("/:category/info", function(req, res){
    
      return res.send({
        message: "You sent a path parameter!",
        next:
          "Now try changing the method - currently GET before the addresss - change it to POST and click Send again."
      });
  });
  app.post("/:category/info", function(req, res) {
    if (req.body.data)
      return res.send({ message: "You sent body data!", next: "Now try..." });
    else
      return res.send({
        message:
          "You sent a post request! Post requests let you pass data to the API.",
        next:
          "Now try adding some data. " +
          "Open the Body tab under the address, select Raw, and enter "+
          "{'data':'hello'} into the empty pane, " +
          "making sure JSON is selected from the dropdown."
      });
  });
  app.get("/lesson", function(req, res) {
    let responseData = new Object();     
    responseData["message"] = "Click Visualize to see more info!";
    responseData["information"] = "You sent a GET request...";
    return res.send(responseData);
  });
};

module.exports = routes;