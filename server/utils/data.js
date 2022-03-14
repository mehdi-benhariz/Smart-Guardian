// Requiring the module
const reader = require("xlsx");
const fs = require("fs");
const path = require("path");
const file = reader.readFile(path.join(__dirname, "../assets/attendency.xlsx"));

const excelDateToJSDate = (excelDate) => {
  var date = new Date(Math.round((excelDate - (25567 + 1)) * 86400 * 1000));
  var converted_date = date.toISOString().split("T")[0];
  return converted_date;
};

// const file = reader.readFile("../assets/attendency.xlsx");
exports.getPresence = async () => {
  let data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      // res.date = excelDateToJSDate(res.date);
      data.push({ ...res, date: excelDateToJSDate(res["attendance/CIN"]) });
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
  const { date, cin } = data;
  const presence = await this.getPresenceByEmployee(cin);
  let lastLine = new presence[presence.length - 1]();
  lastLine[date] = data.presence;
  const newPresence = { ...presence, [date]: data.presence };
  return newPresence;
};
exports.addPresence = async (data) => {
  const { date, CIN } = data;
  const file = reader.readFile(
    path.join(__dirname, "../assets/attendency.xlsx")
  );

  const presence = await this.getPresence();
  //create new presence list
  const l = presence.length;
  if (presence[l - 1].date === date) presence[l - 1][CIN] = data.presence;
  else presence.push({ [CIN]: data.presence || false, date });

  const ws = reader.utils.json_to_sheet(presence);

  reader.utils.book_append_sheet(file, ws);

  // Writing to our file
  reader.writeFile(file, ".attendency.xlsx");

  return presence;
};
