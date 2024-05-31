const User = require("../user/model");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  console.log('Request body:', req.body); // Log request body

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user: user });
  } catch (error) {
    console.log('Error saving user:', error); // Log error
    res.status(500).json({ message: 'Server error' });
  }
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );

    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (errors) {
    done(errors, null);
  }
  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);

    if (!user)
      return res.status(400).send({
        user,
        error: 1,
        message: "Email or password is incorrect",
      });

    let signed = jwt.sign(user, config.secretkey);

    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });

    res.status(200).send({
      user,
      token: signed,
      message: "Login Successfully",
    });
    console.log("User uda masuk", user)

  })(req, res, next);
};

// const logout = async (req, res, next) => {
//   let token = getToken(req);

//   let user = await User.findOneAndUpdate(
//     { token: { $in: [token] } },
//     { $pull: { $token: token } },
//     { useFindAndModify: false }
//   );

//   if (!token || !user)
//     res.json({
//       error: 0,
//       message: "Logout Success",
//     });
// };

// const me = (req, res, next) => {
//   if (!req.user) {
//     res.status(400).send({
//       err: 1,
//       message: "u not login or u token is expird",
//     });
//   }
//   res.json(req.user);
// };

module.exports = {
  register,
  localStrategy,
  login,
  // logout,
  // me,
};