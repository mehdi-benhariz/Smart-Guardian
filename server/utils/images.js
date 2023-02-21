var fs = require("fs");
exports.decodeImg = (data, name) => {
  var Readable = require("stream").Readable;
  //   let base64Image = base64.split(";base64,").pop();
  // let ext = base64.split(";base64,")[0].slice(11);
  let ext = "png";
  const imgBuffer = Buffer.from(data, "svg");

  var s = new Readable();
  console.log({ ext });
  s.push(imgBuffer);
  s.push(null);
  //data:image/
  s.pipe(fs.createWriteStream(`public/qrcodes/${name}.${ext}`));
};

exports.generateQRCode = (data, name) => {
  let QRCode = require("qrcode");
  QRCode.toFile(`public/qrcodes/${name}.png`, data, {
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    width: 500,
    height: 500,
    margin: 0,
  });
};
