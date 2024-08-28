const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const { encode } = require("../middleware/token");

async function hashedPassword(password) {
  return await bcrypt.hashSync(password, 10);
}

async function validatePassword(plainpassword, hashedPassword) {
  return await bcrypt.compare(plainpassword, hashedPassword);
}

exports.register_user = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await hashedPassword(password);

    const isMailExist = await user.findOne({ email });
    if (isMailExist) {
      return res
        .status(409)
        .json({
          message:
            "This email is already registered. Please use a different email.",
        });
    }

    const addUser = new user({
      name: name,
      email: email,
      password: hash,
    });

    if (req.files.length) {
      console.log("reqFiles ::", req.files);
      let file = "";
      req.files.forEach(function (files) {
        file = file + files.filename + "," + process.env.BASE_URL;
      });
      file = file.substring(0, file.lastIndexOf(","));
      addUser.pic = process.env.BASE_URL + file;
    }

    const data = await addUser.save();
    console.log("data ::", data);
    return res.status(200).json({
      msg: "User register successfully!",
      data: data,
    });
  } catch (error) {
    return res.send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkMail = await user.findOne({ email });

    if (!checkMail) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const checkPassword = await validatePassword(password, checkMail.password);
    console.log("checkPassword ::", checkPassword);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Password incorrect",
      });
    }

   const userData = await user.findOne({email}).select("name email pic")
   console.log("userData :::", userData)



    const token = await encode({
      id: checkMail.id,
      
    });

    return res.status(200).json({
      success: true,
      message: "login successsfull!",
      token: token,
      data: userData
    });
  } catch (error) {
    return res.send(error.message);
  }
};

// search api
// exports.allUsers = async (req,res)=>{

//   const userId = req.user;

//   const keyword = req.query.search ? {
//     $or:[
//       {name:{$regex: req.query.search, $options:"i"}},
//       {email:{$regex: req.query.search, $options:"i"}}
//     ]
//   } : {}

//  const users = await user.find(keyword).find({_id:{$ne:userId}})
//  res.send(users)

// };

exports.allUsers = async (req, res) => {
  const userId = req.user;

  // Helper function to escape special characters in the search input
  const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 
  };

  let keyword = {};

  if (req.query.search) {
    try {
      const searchTerm = escapeRegex(req.query.search);
      keyword = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      };
    } catch (error) {
      return res.status(400).send({ message: "Invalid search pattern" });
    }
  }

  try {
    // Find users excluding the current user, and sort them alphabetically by name
    const users = await user
      .find(keyword)
      .find({ _id: { $ne: userId } })
      .sort({ name: 1 }); // 1 for ascending order

    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users", error });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const userId = req.user;

    const myUser = await user.findById(userId).select("name email pic");

    if (!myUser) {
      return res.status(404).json({
        success: false,
        message: "myprofile user not found!",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "myprofile user found successfully!",
        data: myUser,
      });
    }
  } catch (error) {
    return res.send(error.message);
  }
};
