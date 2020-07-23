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
      res.status(200).json({
        id: 1,
        name: "Blanche Devereux",
        type: "Individual"
      });
    }
  });

  //get all users
  app.get("/customers", function(req, res) {
    res.status(200).json(
      {
        id: 1,
        name: "Blanche Devereux",
        type: "Individual"
      },
      {
        id: 2,
        name: "Shady Pines",
        type: "Company"
      }
    );
  });

  //add new user
  app.post("/customer", function(req, res) {
    const apiSecret = req.get("admin_key");
    if (!apiSecret)
      res.status(401).json({ error: "You need to supply an auth key!" });
    else if (!req.body.name)
      return res.send({ status: "error", message: "no name" });
    else if (!req.body.type)
      return res.send({ status: "error", message: "no type" });
    else res.status(201).json({ status: "customer added" });
  });

  //update user
  app.patch("/customer", function(req, res) {
    if (!req.body.name)
      return res.send({ status: "error", message: "no name" });
    else if (!req.body.type)
      return res.send({ status: "error", message: "no type" });
    else res.status(201).json({ status: "customer updated" });
  });
};

module.exports = routes;
