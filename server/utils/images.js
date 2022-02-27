var fs = require("fs");
exports.decodeImg = (base64, name) => {
  var Readable = require("stream").Readable;
  //   let base64Image = base64.split(";base64,").pop();
  // let ext = base64.split(";base64,")[0].slice(11);
  let ext = "png";
  const imgBuffer = Buffer.from(base64, "svg");

  var s = new Readable();
  console.log({ ext });
  s.push(imgBuffer);
  s.push(null);
  //data:image/
  s.pipe(fs.createWriteStream(`public/product_images/${name}.${ext}`));
};
