const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { USERDATA_URL } = require("../config/config");
const fs = require("fs");
const pMap = require("p-map");
const R = require("ramda");
const USER = require("../models/userModel");

//get request for adding users
router.get("/adduser", async (req, res, next) => {
  // headers
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const url = `${USERDATA_URL}?results=100`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });
  const { status } = response;
  const payload = await response.json();

  const { results = [] } = payload;

  if (status == 200) {
    const mapper = async (user) => {
      try {
        await USER.addUser(user);
      } catch (err) {
        res.json({
          success: false,
          msg: `error in insertion : ${err}`,
        });
      }
    };
    await pMap(results, mapper, { concurrency: 1 });
    res.json({
      success: true,
      msg: "user succesfully inserted",
    });
  }
  res.json({
    success: false,
    msg: "insertion failed error in API response",
  });
});

// post request for report
router.post("/report", async (req, res, next) => {
  try {
    if(!req.body.gender)
    {
      res.json({
        success:false,
        msg: "insufficient data"
      })
    }
    const {body:{gender}} = req
    const report = [];
    const nationalities = await USER.distinctNationality();
    const userDetails = await USER.getAllUsers();
    const mapper = async (nationality) => {
      let countForThirty = 0;
      let countForFifty = 0;
      let countAboveFifty = 0;
      await Promise.all(
        R.map(async (user) => {
          if (R.equals(nationality, user.nat) && R.equals(gender,user.gender)) {
            if (user.dob.age >= 0 && user.dob.age < 30) {
              countForThirty = countForThirty + 1;
            }
            if (user.dob.age >= 30 && user.dob.age < 50) {
              countForFifty = countForFifty + 1;
            }
            if (user.dob.age >= 50) {
              countAboveFifty = countAboveFifty + 1;
            }
          }
        }, userDetails)
      );
      report.push(
        {
          Gender : gender,
          Nationality: nationality,
          "0-30": countForThirty,
          "30-50": countForFifty,
          "50 and above": countAboveFifty,
        }
      );
    };
    await pMap(nationalities, mapper, { concurrency: 1 });
    res.json({
      success: true,
      msg: report,
    });
  } catch (err) {
    res.json({
      success: false,
      msg: `error in fetching report : ${err}`,
    });
  }
});

module.exports = router;
