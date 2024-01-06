const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserRegisterSchema = mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNo: {
    type: Number,
    unique: true,
    required: true,
    minLength: 10,
    maxLength: 10,
  },
  Gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserRegisterSchema.methods.getToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    // console.log(token);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log("token:", token);
    return token;
  } catch (e) {
    res.status(400).send(e);
  }
};

UserRegisterSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      this.confirmPassword = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Register = mongoose.model("Register", UserRegisterSchema);
module.exports = Register;
