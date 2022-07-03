const express = require("express");
const app = express();
const authRouter = require("./auth.route");
const docRouter = require("./doc.route");
const userRouter = require("./user.route");
const notifRouter = require("./notif.route");

app.use("/auth/", authRouter);
app.use("/doc/", docRouter);
app.use("/user/", userRouter);
app.use("/notif/", notifRouter);

module.exports = app;