require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
require("./db/conn");
const hbs = require("hbs");
const port = process.env.PORT || 3000;
const pathName = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
const Register = require("./models/registers");
const exp = require("constants");
const bcrypt = require("bcryptjs");
app.use(express.static(pathName));
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialPath);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;
    // console.log(req.body.FirstName);
    if (password === cpassword) {
      const userData = new Register({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        Gender: req.body.Gender,
        age: req.body.age,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      });
      // console.log(userData);
      const token = await userData.getToken();
      // console.log("appJs: ", token);
      //midleware
      const data = await userData.save();
      res.status(200).render("index");
    } else {
      res.status(200).send("Password Not Match");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(password);
    const validId = await Register.findOne({ email: email });
    console.log(validId);

    const isMatch = await bcrypt.compare(password, validId.password);
    // console.log(isMatch);
    const token = await validId.getToken();
    console.log("appJs: ", token);
    if (isMatch) {
      res.render("index");
    } else {
      res.send("wrong password");
    }
  } catch (e) {
    res.status(400).send("Invalid Email");
  }
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(port, (e) => {
  console.log(`server is running at port ${port}`);
});
