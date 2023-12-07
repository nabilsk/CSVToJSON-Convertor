const fs = require("fs").promises;
const createReadStream = require("fs").createReadStream;

const { dotNotationToObj } = require("./format");

const readCSVFile = async (file) => {
  const data = [];
  let firstChunk = true;
  let headerFields = [];
  return new Promise((resolve, reject) => {
    createReadStream(file, { encoding: "utf-8" })
      .on("data", (chunk) => {
        //reading each chunk of the file and splitting it in separate row array
        const chunkArr = chunk.split("\n").filter((row) => row);

        if (firstChunk) {
          //if row is first in table then add declare it as a header keys
          headerFields = chunkArr[0].split(",");
        }

        //run loop for every row except header
        for (let i = 1; i < chunkArr.length; i++) {
          //created an variable to store converted row object
          let rowObj = {};
          //split row into columns array
          const rowField = chunkArr[i].split(",");

          //run loop for every column
          for (let j = 0; j < rowField.length; j++) {
            const columnValue = rowField[j];
            //convert to json function which takes object variable, value of column & respective header
            rowObj = dotNotationToObj(rowObj, headerFields[j], columnValue);
          }

          data.push(rowObj);
          firstChunk = false;
        }
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (err) => {
        reject({});
      });
  });
};

const deleteFile = (file) => {
  return fs.unlink(file);
};

module.exports = { readCSVFile, deleteFile };
