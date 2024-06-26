const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const { createProxyMiddleware } = require("http-proxy-middleware");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const passwordRouter = require("./routes/password");

const { loginUser, authenticateToken } = require("./authUser");

const app = express();

// cors production server
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/", // Rewrite paths to remove "/api" prefix before proxying
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers["access-control-allow-origin"] = process.env.CLIENT_URL;
      proxyRes.headers["access-control-allow-credentials"] = "true";
    },
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// login route
app.post("/", authenticateToken, loginUser);

// server route
app.get("/", (req, res) => {
  res.render("index", {
    heading: "Breakfast Server",
    title: "Server running successfully",
  });
});

// user routes
app.use("/User/home", userRouter);

//admin routes
app.use("/Admin/Dashboard", indexRouter);
app.use("/Admin/Dashboard/Users", userRouter);

// accessible routes for both admin and user
app.use("/Admin/Dashboard/Products", productRouter);
app.use("/Admin/Dashboard/Orders", orderRouter);
app.use("/User/home/Products", productRouter);
app.use("/User/home/Orders", orderRouter);

//password routes
app.use("/Password", passwordRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
