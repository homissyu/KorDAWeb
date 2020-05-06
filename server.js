const fs = require("fs");
const express = require("express");
const vhost = require("vhost");
const vhttps = require("vhttps");
const app = express();
const blog = express();
const www = express();

www.use("/", require(__dirname+"/routes/index"));

// blog.use("/", require("/Users/karlchoi/ghost/current/index"));

app.use(vhost("app.korda.me", www));
app.use(vhost("blog.korda.me", blog));

app.listen(80);