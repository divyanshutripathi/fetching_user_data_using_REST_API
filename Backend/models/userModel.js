const mongoose = require("mongoose");

const userModel = {
  gender: {
    type: String,
    required: true,
  },
  name: {
    type: Object,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
  dob: {
    type: Object,
    required: true,
  },
  nat: {
    type: String,
    required: true
  },
  email:{
    type:String,
    required:true,
  }
};
const USER = (module.exports = mongoose.model("user", userModel));

module.exports.distinctNationality = async function (callback) {
  return await USER.distinct('nat',callback)
};

module.exports.getAllUsers = async function (callback) {
  return await USER.find(callback);
};

module.exports.addUser = async function (user, callback) {
  await USER.create(user, callback);
};
// module.exports.getUserbyId=function(userid,callback){
//     query={
//         apikey:userid
//     }
//     USER.findOne(query,callback)
// }
module.exports.getbyUsername = async function (userName, callback) {
  query = {
    username: userName,
  };
  await USER.findOne(query, callback);
};

module.exports.removeUser = function (user, callback) {
  query = {
    apikey: user.apikey,
  };
  User.findByIdAndRemove(query, callback);
};

module.exports;
