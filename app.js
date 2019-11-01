var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var config = require("./config/index");
var kue = require("kue");

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

//* ******************** DATABASE CONNECTION *********************//
const DB_OPTS = {
  auto_reconnect: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 5000,
  keepAlive: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  useMongoClient: true
};

mongoose.connect(config.env.development.dbUrl, DB_OPTS);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection-error"));
db.once("open", () => {
  console.log("info", "Connected to mongoDb :-", config.env.development.dbUrl);
});

db.on("disconnected", () => {
  console.log(`Db_URL is: ${config.env.development.dbUrl}`);
  mongoose.connect(config.env.development.dbUrl, DB_OPTS);
});

require("./utils/passport")();
// var kueUiExpress = require('kue-ui-express');
//Raven
var Raven = require("raven");
if (process.env.NODE_ENV == "production") {
  Raven.config(
    "https://644fec185e0a490a982d8e30268d90d1:603b200ed1334ffe8c5be281bb4decc7@sentry.io/223922"
  ).install();
} else {
  Raven.config(
    "https://644fec185e0a490a982d868d9d1:603b200ed1334ffe8c5be281bb4decc7@sentry.io/223922"
  ).install();
}

var bodyParser = require("body-parser");

var index = require("./routes/index");

// var mongoConnect = require('./models/mongoose_connection');

var app = express();
app.set("port", process.env.PORT || 3000);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// console.log(Raven);
app.use(Raven.requestHandler());
app.use(cors({ origin: "*" }));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
// kueUiExpress(app, '/kue/', '/api/kue');
// app.use('/api', kue.app);

app.use(Raven.errorHandler());
//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
