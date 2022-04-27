var fs = require("fs");
const path = require("path");
const { parse } = require("fast-csv");
const { format, write } = require("@fast-csv/format");
const { Console } = require("console");

//!helper functions
function ExcelDateToJSDate(serial) {
  let utc_days = Math.floor(serial - 25569);
  let utc_value = utc_days * 86400;
  let date_info = new Date(utc_value * 1000);

  let fractional_day = serial - Math.floor(serial) + 0.0000001;

  let total_seconds = Math.floor(86400 * fractional_day);

  let seconds = total_seconds % 60;

  total_seconds -= seconds;

  let hours = Math.floor(total_seconds / (60 * 60));
  let minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}

function JSDateToExcelDate(inDate) {
  const offset = inDate.getTimezoneOffset();
  yourDate = new Date(inDate.getTime() - offset * 60 * 1000);
  // console.log(ExcelDateToJSDate(2020 - 01 - 01));
  return yourDate.toISOString().split("T")[0];
}
//initilize a period of presence
const getDaysArray = (start, end) => {
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  )
    arr[[JSDateToExcelDate(new Date(dt))]] = false;
  return arr;
};
function addDays(originalDate, days) {
  cloneDate = new Date(originalDate.valueOf());
  cloneDate.setDate(cloneDate.getDate() + days);
  return cloneDate;
}
//!helper functions

exports.getPresence = async () => {
  let rows = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, "../assets/test.csv"))
      .pipe(
        parse({
          headers: true,
          alwaysWriteHeaders: true,
          headers: true,
          discardUnmappedColumns: true,
        })
      )
      .on("error", (error) => reject(error))
      .on("data", (row) => rows.push(row))
      .on("end", (rowCount) => {
        console.log(`Parsed ${rowCount} rows`);
        resolve(rows);
      });
  });
};
//insert a new user with initial presence
exports.insertUser = async (CIN) => {
  let rows = [];
  rows = await this.getPresence();
  console.log({ rows });
  //added employee
  let newEmployee = { XXXX: CIN };
  //append initilized period of presence

  const start = JSDateToExcelDate(new Date());
  const end = JSDateToExcelDate(addDays(new Date(), 2));
  newEmployee = {
    ...newEmployee,
    ...getDaysArray(start, end),
  };

  rows.push(newEmployee);
  console.log({ rows });
  //open the file to append a new user
  //todo could be more optimized
  const csvFile = fs.createWriteStream(
    path.resolve(__dirname, "../assets/test.csv"),
    {
      flags: "w",
    }
  );
  write(rows, {
    alwaysWriteHeaders: true,
    headers: true,
    discardUnmappedColumns: true,
  })
    .pipe(csvFile)
    .on("error", function (data) {
      return false;
    });
};

exports.addPresence = async (date, CIN) => {
  let rows = await this.getPresence();
  console.log(rows);
  //check the length of rows
  //if the CIN doesn't exist add it !
  // if the date doesn't exist add it
  date = JSDateToExcelDate(new Date(date));
  rows.forEach((row) => {
    if (row.XXXX === CIN) row[[date]] = true;
  });
  console.log(rows);
  flag = "w";
  const csvFile = fs.createWriteStream(
    path.resolve(__dirname, "../assets/test.csv"),
    {
      flags: flag,
    }
  );
  write(rows, {
    alwaysWriteHeaders: true,
    headers: true,
    discardUnmappedColumns: true,
  }).pipe(csvFile);
};

exports.getPresenceByDate = async (start, end) => {
  let data = [];
  data = await this.getPresence();
  // if (start && end)
  //   return data.filter((res) => res.date >= start && res.date <= end);
  // if (start) return data.filter((res) => res.date >= start);
  // if (end) return data.filter((res) => res.date <= end);
  return data;
};

exports.getPresenceByEmployee = async (cin) => {
  let data = [];
  data = await this.getPresence();
  return data.find((res) => res["XXXX"] === cin);
};
