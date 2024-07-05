import qr from "qrcode";
import { Service } from "typedi";
import logger from "../utils/logger";
import {
  readFile,
  writeFile,
  unlink,
  mkdir,
  rmdir,
  readdir,
} from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";
import { SKRSContext2D, createCanvas, loadImage } from "@napi-rs/canvas";
import PaymentsService from "./payments.services";

@Service()
export default class CardsServices {
  private _baseDir = path.join(__dirname, "..", "tmp");
  private _cardsDir = path.join(this._baseDir, "cards");
  private _qrCodesDir = path.join(this._baseDir, "codes");
  private paymentService: PaymentsService;

  constructor(paymentService: PaymentsService) {
    this.initializeDirs();
    this.paymentService = paymentService;
  }

  /**
   * Make sure the `tmp`, `tmp/cards` and `tmp/codes` directories exist before hand
   *
   * @private
   * @memberof CardsServices
   */
  private async initializeDirs() {
    const tmpContent = await readdir(this._baseDir).catch(async (error) => {
      await mkdir(this._baseDir);
      return [];
    });

    if (!(tmpContent as string[]).includes("cards")) mkdir(this._cardsDir);
    if (!(tmpContent as string[]).includes("codes")) mkdir(this._qrCodesDir);

    // console.log({ tmpContent });
  }

  async generateCard(reference: string, lang: "en" | "fr" = "fr") {
    // TODO: Generate QR Code
    // TODO: Add QR Code and candidate's info on recto and save into tmp under `reference` dir
    // TODO: Assemble card's recto and verso
    // TODO: Upload card to cloudinary and save path to DB(Payment)
  }

  /**
   * Generate QR Code and save it to `this.qrCodesDir/${reference}.png`
   *
   * @param {{ data: any; reference: string }} { data, reference }
   * @return {true | undefined}
   * @memberof CardsServices
   */
  generateQrCode({
    data,
    reference,
  }: {
    data: any;
    reference: string;
  }): true | undefined {
    try {
      logger.info("Generating qr code for: " + reference + "...");
      const dest = path.join(this._qrCodesDir, `${reference}.png`);

      qr.toFile(dest, data, { width: 450 }, async function (err) {
        if (err) throw err;
        // const file = await readFile(dest);
        // await writeFile(`./src/tmp/${reference}.png`, file);
        // await unlink(dest);
        logger.info("Done");
      });

      return true;
    } catch (error) {
      logger.error(error);
      logger.info("Failed generating qr code for: " + reference);
      return undefined;
    }
  }

  /**
   * Add QR Code and candidate's info on recto and save into tmp under `this._cardsDir/${reference}-recto.png` dir
   *
   * @param {string} reference
   * @param {("en" | "fr")} lang
   * @memberof CardsServices
   */
  async buildCardRecto(reference: string, lang: "en" | "fr") {
    const recto = sharp(
      path.join(__dirname, "..", "public", "templates", lang, "recto.png")
    );
    const qrCode = sharp(path.join(this._qrCodesDir, reference + ".png"));
    const metadata = await recto.metadata();
    // Create canvas and add text to combined image
    const canvas = createCanvas(
      metadata.width as number,
      metadata.height as number
    );
    const ctx = canvas.getContext("2d");

    const output = path.join(this._cardsDir, reference + "-recto.png");

    // Load combined image onto canvas
    const img = await loadImage(recto);
    const qr = await loadImage(qrCode);
    ctx.drawImage(img, 0, 0);

    // Overlay the QR Code
    ctx.drawImage(qr, 65, 1160);
    ctx.textAlign = "center";

    // Set text properties and add text
    // Lastname
    this.insertText(ctx, "ABDEL-KALIF", { left: 405, top: 676 });
    // Firstname
    this.insertText(ctx, "BEN HAMADOU", { left: 520, top: 745 });
    // City
    this.insertText(ctx, "Douala", { left: 355, top: 813 });
    // Phone
    this.insertText(ctx, "+237656144663", { left: 410, top: 880 });
    this.insertText(ctx, "FORWARD", { left: 500, top: 955 });
    this.insertText(
      ctx,
      "24 Novembre 2024",
      { left: 900, top: 1460 },
      { color: "black", size: 40 }
    );
    this.insertText(
      ctx,
      "YA-W69W",
      { left: 825, top: 1530 },
      { color: "black", size: 40 }
    );

    // Save final image with text
    const finalBuffer = canvas.toBuffer("image/png");
    sharp(finalBuffer).toFile(output, (err, info) => {
      if (err) {
        console.error("Error writing image:", err);
      } else {
        console.log("Image combined and text added successfully");
      }
    });
  }

  private insertText(
    ctx: SKRSContext2D,
    text: string,
    coords: { left: number; top: number },
    options?: { color?: string; size?: number }
  ) {
    const fontSize = options?.size ?? 50;
    const fontColor = options?.color ?? "white";
    ctx.font = `${fontSize}px Inter`;
    ctx.fillStyle = fontColor;
    ctx.fillText(text, coords.left, coords.top);
  }

  // Assemble card's recto and verso
  async assembleCard(imgPath?: string, lang: "en" | "fr" = "fr") {
    // Define the paths to your images
    const image1Path = path.join(
      __dirname,
      "..",
      "public",
      "model",
      "model.png"
    );
    const image2Path = path.join(
      __dirname,
      "..",
      "public",
      "templates",
      lang,
      "verso.png"
    );

    // Define the margin space between images
    const margin = 60;

    // Define the output path
    const output = path.join(__dirname, "..", "tmp", "cards", "output.png");
    try {
      // Get metadata of the images
      const metadata1 = await sharp(image1Path).metadata();
      const metadata2 = await sharp(image2Path).metadata();

      // Resize images and extend with white background
      const [data1, data2] = await Promise.all([
        sharp(image1Path)
          .resize(Math.round((metadata1.width as number) * 0.8))
          .extend({
            bottom: margin,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .toBuffer(),
        sharp(image2Path)
          .resize(Math.round((metadata1.width as number) * 0.8))
          .extend({
            top: margin / 2,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .toBuffer(),
      ]);

      const image1 = await sharp(data1).metadata();
      const image2 = await sharp(data2).metadata();

      // Combine images vertically with specified margin
      await sharp({
        create: {
          width: Math.round((metadata1.width as number) * 0.8),
          height:
            (image1.height as number) + (image2.height as number) + margin,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .composite([
          { input: data1, top: 0, left: 0 },
          {
            input: data2,
            top: (image1.height as number) + margin / 2,
            left: 0,
          },
        ])
        .toFile(output);
    } catch (err) {
      console.error("Error processing images:", err);
    }
  }
}
