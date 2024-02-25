const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Url = require("./models/url");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// connect to database
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => app.listen(process.env.PORT))
  .catch((err) => console.log(err));

// register view engines
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware & static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.post("/", (req, res) => {
  const url = new Url(req.body);
  Url.find({ shortUrl: url.shortUrl })
    .then((result) => {
      if (result.length != 0) {
        res.render("create", {
          title: "Create",
          message: "Entered Short URL already exists",
        });
      } else {
        url
          .save()
          .then((result) => {
            res.redirect("/done");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.get("/create", (req, res) => {
  res.render("create", { title: "Create", message: "Create a new Short URL" });
});

app.get("/about", (req, res) => {
  res.redirect("https://harshit-jain52.github.io/");
});

app.get("/done", (req, res) => {
  res.render("done", { title: "Create" });
});

app.get("/:short", (req, res) => {
  const short = req.params.short;
  Url.find({ shortUrl: short })
    .then((result) => {
      res.redirect(result[0].origUrl);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render("404", { title: "404" });
    });
});
