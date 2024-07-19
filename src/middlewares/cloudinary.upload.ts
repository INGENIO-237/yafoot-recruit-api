import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import Container from "typedi";
import CloudinaryServices from "../services/cloudinary.services";
import { removeTmpCandidateImg } from "../utils/multer";
import { HTTP } from "../utils/constants/common";

const cloudinary = Container.get(CloudinaryServices);

export default async function uploadCandidateImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.file) {
    const { url, publicId } = await cloudinary.uploadImage(req.file.path);

    if (url) {
      req.body.image = { url, publicId };
        removeTmpCandidateImg(req.file.path);
    } else {
      return res
        .status(HTTP.SERVER_ERROR)
        .json([{ message: "Something went wrong. Retry later." }]);
    }
  } else {
    return res
      .status(HTTP.SERVER_ERROR)
      .json([{ message: "Something went wrong. Retry later." }]);
  }

  return next();
}
