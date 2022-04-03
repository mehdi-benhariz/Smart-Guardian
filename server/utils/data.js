// Requiring the module
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const file = xlsx.readFile(path.join(__dirname, "../assets/attendancy.xlsx"));

const excelDateToJSDate = (excelDate) => {
  var date = new Date(Math.round((excelDate - (25567 + 1)) * 86400 * 1000));
  var converted_date = date.toISOString().split("T")[0];
  return converted_date;
};

// const file = xlsx.readFile("../assets/attendency.xlsx");
exports.getPresence = async () => {
  let data = [];
  // const file = xlsx.readFile(path.join(__dirname, "../assets/attendency.xlsx"));
  const sheets = file.SheetNames;
  const ws = file.Sheets[sheets[0]];
  const dataFromFile = xlsx.utils.sheet_to_json(ws);
  console.log(dataFromFile);
  for (let i = 0; i < sheets.length; i++) {
    const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      // res.date = excelDateToJSDate(res.date);
      // console.log(res["Date-CIN"]);
      // console.log(res);
      data.push({ ...res, date: excelDateToJSDate(res["Date-CIN"]) });
    });
  }
  return data;
};

exports.getPresenceByDate = async (start, end) => {
  let data = [];
  data = await this.getPresence();
  if (start && end)
    return data.filter((res) => res.date >= start && res.date <= end);
  if (start) return data.filter((res) => res.date >= start);
  if (end) return data.filter((res) => res.date <= end);
  return data;
};

exports.getPresenceByEmployee = async (cin) => {
  let data = [];
  data = await this.getPresence();
  return data.map((res) => ({ [res.date]: JSON.parse(res[cin]) || false }));
};

exports.addPresence = async (data) => {
  const { date, CIN } = data;
  const file = xlsx.readFile(path.join(__dirname, "../assets/attendency.xlsx"));

  const presence = await this.getPresence();
  //create new presence list
  const l = presence.length;
  if (presence[l - 1].date === date) presence[l - 1][CIN] = data.presence;
  else presence.push({ [CIN]: data.presence || false, date });
  console.log(presence);
  const ws = xlsx.utils.json_to_sheet(presence);

  xlsx.utils.book_append_sheet(file, ws, "attendancy");

  // Writing to our file
  xlsx.writeFile(file, "assets/attendency.xlsx");

  return presence;
};
