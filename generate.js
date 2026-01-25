const fs = require("fs");
const path = require("path");

const folder = path.join(__dirname, "photos");
const out = path.join(__dirname, "media.json");

// delete old file if exists
if (fs.existsSync(out)) {
  fs.chmodSync(out, 0o666);
  fs.unlinkSync(out);
}

const files = fs.readdirSync(folder).filter(f =>
  /\.(jpe?g|png|gif|webp|mp4|webm|mov)$/i.test(f)
);

fs.writeFileSync(out, JSON.stringify(files, null, 2));

console.log("media.json created with", files.length, "files");
