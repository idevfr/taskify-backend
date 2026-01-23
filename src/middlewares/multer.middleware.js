import multer from "multer";
import fs from "fs";
import path from "path";
const destinationDir = path.resolve(process.cwd(), "../../public/temp");
//   process.env.NODE_ENV === "development"
//     ? resolve(__dirname, "../../../backend/public/temp")
//     : "/public/temp";

if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${destinationDir}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage: storage });
