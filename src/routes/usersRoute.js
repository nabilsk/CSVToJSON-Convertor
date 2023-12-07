const express = require("express");

const {
  addUsers,
  deleteUsers,
  getAgeDistribution,
  getDummyFile,
} = require("../controllers/usersController");

const router = express.Router();

router.route("/").post(addUsers).delete(deleteUsers);
router.route("/age-distribution").get(getAgeDistribution);
router.route("/file").get(getDummyFile);

module.exports = router;
