import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const destinationDir = resolve(__dirname, "../../../backend/public/temp");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${destinationDir}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
