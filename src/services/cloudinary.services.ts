import { v2 as cloudinary } from "cloudinary";
import { Service } from "typedi";
import logger from "../utils/logger";

@Service()
export default class CloudinaryServices {
  async uploadImage(imagePath: string, filename?: string) {
    try {
      const { secure_url, public_id } = await cloudinary.uploader
        .upload(imagePath, {
          public_id: filename,
          overwrite: true,
        })
        .then((res) => res);
      return { url: secure_url, publicId: public_id };
    } catch (error) {
      logger.error(error);
      return { url: undefined };
    }
  }

  async uploadCardImage(imagePath: string, name: string) {
    logger.info("Uploading card to cloudinary...");
    const { url } = (await this.uploadImage(imagePath, name)) as {
      url: string;
    };
    logger.info(url);
    logger.info("Card uploaded.");

    return url;
  }
}
