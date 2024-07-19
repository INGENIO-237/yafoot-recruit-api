import multer from "multer";
import { join } from "node:path";
import { unlink } from "fs";
import logger from "./logger";

const tmpDir = join(__dirname, "..", "tmp");

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "candidate" + "-" + uniqueSuffix);
  },
});

export function removeTmpCandidateImg(path: string) {
  unlink(path, (err) => {
    logger.error("Failed removing: ", path);
    logger.error(err);
  });
}
