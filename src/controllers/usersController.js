const { StatusCodes } = require("http-status-codes");
const path = require("path");

const CustomError = require("../errors");
const customUtils = require("../utils");
const Model = require("../models");

const addUsers = async (req, res) => {
  if (!req.files || !req.files.users) {
    throw new CustomError.BadRequestError("No file uploaded");
  }

  const usersFile = req.files.users;

  if (usersFile.mimetype !== "text/csv") {
    await customUtils.deleteFile(usersFile.tempFilePath);
    throw new CustomError.BadRequestError("Please upload a csv file");
  }

  const userList = await customUtils.readCSVFile(usersFile.tempFilePath);

  const users = new Model.Users();
  await users.create(userList);

  await customUtils.deleteFile(usersFile.tempFilePath);

  res.status(StatusCodes.OK).json({});
};

const deleteUsers = async (req, res) => {
  const users = new Model.Users();
  await users.deleteAll();

  res.status(StatusCodes.OK).json({});
};

const getAgeDistribution = async (req, res) => {
  const data = await new Model.Users().calculateAgeDistribution();

  res.status(StatusCodes.OK).json({ data });
};

const getDummyFile = async (req, res) => {
  const file = path.resolve(__dirname, "../../data/dummy-data.csv");
  res.download(file);
};

module.exports = { addUsers, deleteUsers, getAgeDistribution, getDummyFile };
