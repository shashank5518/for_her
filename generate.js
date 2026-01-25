const fs = require("fs");

const folder = "./photos";

const files = fs.readdirSync(folder).filter(f =>
  /\.(jpe?g|png|gif|webp|mp4|webm|mov)$/i.test(f)
);

fs.writeFileSync("media.json", JSON.stringify(files, null, 2));

console.log("media.json created with", files.length, "files");
