/*
Hello! This is a learning API for the Postman student expert training. Check out the template: tbc
*/

var xml = require("xml");

var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);
const faker = require("faker");
var validator = require("email-validator");

db.defaults({
  learners: [
    {
      id: 1,
      email: "sue.smith@postman.com",
      methods: 0,
      bodies: 0,
      auth: 0,
      vars: 0,
      script: 0,
      rand: "Sue"
    }
  ],
  count: 1,
  calls: []
}).write();
//email is query param
//template includes unresolved var

var routes = function(app) {
  //
  // This route processes GET requests, by using the `get()` method in express, and we're looking for them on
  // the root of the application (in this case that's https://rest-api.glitch.me/), since we've
  // specified `"/"`.  For any GET request received at "/", we're sending some HTML back and logging the
  // request to the console. The HTML you see in the browser is what `res.send()` is sending back.
  //
  app.get("/", function(req, res) {
    var newDate = new Date();
    db.get("calls")
      .push({
        when: newDate.toDateString() + " " + newDate.toTimeString(),
        where: "GET /"
      })
      .write();
    res.status(200).json({
      message:
        "Use the API 101 template in Postman to learn API basics! Import the collection in Postman by clicking " +
        "New > Templates, and searching for 'API 101'. Open the first request in the collection and click Send. " +
        "To see the API code navigate to https://glitch.com/edit/#!/api-101 in your web browser"
    });
    console.log("Received GET");
  });

  var welcomeMsg =
    "You're using the Postman Skill Checker! " +
    "Click Visualize for a more readable view of the response.";

  app.use("/skills", function(req, res, next) {
    if (
      req.method === "GET" ||
      req.method === "POST" ||
      req.method === "PUT" ||
      req.method === "DELETE"
    ) {
      var newDate = new Date();
      db.get("calls")
        .push({
          when: newDate.toDateString() + " " + newDate.toTimeString(),
          where: "GET /skills",
          what: req.get("user-id")
        })
        .write();

      var existing = db
        .get("learners")
        .find({ id: req.get("user-id") })
        .value();
      var done = true;
      let learner = {};
      if (existing) {
        let email = "",
          bodies = 0,
          methods = 0,
          auth = 0,
          vars = 0,
          script = 0;
        if (req.query.email && req.query.email.length > 0 && validator.validate(req.query.email))
          email = req.query.email;

        if (req.body.name) bodies = 1;
        if (
          req.method === "POST" ||
          req.method === "PUT" ||
          req.method === "DELETE"
        )
          methods = 1;
        if (req.get("auth_key")) auth = 1;
        if (req.get("course").indexOf("{{") < 0) vars = 1;
        if (req.get("response-value") == existing.rand) script = 1;
        learner = {
          email: email,
          methods: methods,
          bodies: bodies,
          auth: auth,
          vars: vars,
          script: script,
          rand: existing.rand
        };
        db.get("learners")
          .find({ id: req.get("user-id") })
          .assign(learner)
          .write();
      } else {
        learner = {
          id: req.get("user-id"),
          email: "",
          methods: 0,
          bodies: 0,
          auth: 0,
          vars: 0,
          script: 0,
          rand: faker.name.firstName()
        };
        db.get("learners")
          .push(learner)
          .write();
      }
      if (
        learner.email.length < 1 ||
        learner.methods < 1 ||
        learner.bodies < 1 ||
        learner.auth < 1 ||
        learner.vars < 1 ||
        learner.script < 1
      )
        done = false;
      let statusCode = done ? 200 : 400;
      let titleMsg = done
        ? "Skill checker complete!!!"
        : "Skill checker incomplete!";
      let introMsg = done
        ? "You completed the skill checker! Next....."
        : "Complete each of the following request configurations and keep hitting Send to see the list update. " +
          "When you're done you'll get a 200 OK status code!";
      res.status(statusCode).json({
        welcome: welcomeMsg,
        title: titleMsg,
        intro: introMsg,
        skills: [
          {
            name: "Changed method",
            hint: "Change the request method to POST, PUT, or DELETE.",
            value: learner.methods > 0 ? true : false
          },
          {
            name: "Sent query parameter",
            hint:
              "Add 'email' as a query param, with your student training email address (personal, not your school email) as the value.",
            value: learner.email.length > 0 ? true : false
          },
          {
            name: "Added body data",
            hint:
              "Add JSON body data including a field `name` with the value as your name.",
            value: learner.bodies > 0 ? true : false
          },
          {
            name: "Authorized",
            hint:
              "Add API Key auth with the name `auth_key` and the name of your school as the value (add to the request header).",
            value: learner.auth > 0 ? true : false
          },
          {
            name: "Set a variable",
            hint:
              "Add a new variable to the collection, naming it 'myCourse' and giving it the name of your course as the Current value. " +
              "(Leave the user-id var in place.)",
            value: learner.vars > 0 ? true : false
          },
          {
            name: "Added a script",
            hint:
              "Add script code to the request Tests to set a collection variable named 'responseData', with a value from the `rand` field in the response JSON. " +
              "Hint: you'll need to run the request twice because the test code won't run until after the response is received.",
            value: learner.script > 0 ? true : false
          }
        ],
        rand: "" + learner.rand
      });
    } else next();
  });

  //  app.get("/skills", function(req, res) {

  //  });

  //protect everything after this by checking for the secret
  app.use((req, res, next) => {
    const apiSecret = req.get("admin_key");
    if (!apiSecret || apiSecret !== process.env.SECRET) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      next();
    }
  });

  // removes entries from users and populates it with default users
  //  app.get("/reset", (request, response) => {

  //    response.redirect("/");
  //  });

  // removes all entries from the collection
  app.get("/clear", (request, response) => {
    // removes all entries from the collection
    db.get("learners")
      .remove()
      .write();
    console.log("Database cleared");
    response.redirect("/");
  });

  //get all entries
  app.get("/all", function(req, res) {
    var learners = db.get("learners").value();
    res.status(200).json({
      learners: learners
    });
  });
  //get all entries
  app.get("/calls", function(req, res) {
    var calls = db.get("calls").value();
    console.log(process.env.PROJECT_REMIX_CHAIN);
    res.status(200).json(calls);
  });
  //admin delete
  app.delete("/records", function(req, res) {
    db.get("learners")
      .remove({ id: parseInt(req.query.learner_id) })
      .write();

    res.status(200).json({ message: "deleted" });
  });
};

module.exports = routes;
