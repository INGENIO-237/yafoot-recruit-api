import qr from "qrcode";
import { Service } from "typedi";
import logger from "../utils/logger";
import fs from "node:fs/promises";

@Service()
export default class CardsServices {
  async generateQrCode({ data, name }: { data: any; name: string }) {
    try {
      logger.info("Generating qr code for: " + name + "...");
      const dest = `./${name}.png`;
      qr.toFile(dest, data, async function (err) {
        if (err) throw err;
        const file = await fs.readFile(dest);
        await fs.writeFile(`./src/tmp/${name}.png`, file);
        await fs.unlink(dest);
        logger.info("Done");
      });
    } catch (error) {
      logger.error(error);
      logger.info("Failed generating qr code for: " + name);
    }
  }
}
