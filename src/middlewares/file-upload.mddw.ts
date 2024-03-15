import multer from "multer";
import { mkdir, access } from "node:fs/promises";

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    access("./uploads")
      .then(() => {
        cb(null, "uploads");
      })
      .catch(async () => {
        await mkdir("./uploads");
        cb(null, "uploads");
      });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

export const uploadMiddleware = multer({ storage });
