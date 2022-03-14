// Requiring the module
const reader = require("xlsx");
const fs = require("fs");
const path = require("path");
const file = reader.readFile(path.join(__dirname, "../assets/attendency.xlsx"));

// Reading our test file
// const file = reader.readFile("../assets/attendency.xlsx");
exports.getPresence = async (cin) => {
  let data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }
  console.log(data);
};
