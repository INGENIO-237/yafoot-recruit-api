import qr from "qrcode";
import { Service } from "typedi";
import logger from "../utils/logger";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import sharp, { Metadata } from "sharp";
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
  /**
   * Generate candidate's participation card
   *
   * @param {string} reference
   * @param {("en" | "fr")} [lang="fr"]
   * @memberof CardsServices
   */
  async generateCard(reference: string, lang: "en" | "fr" = "en") {
    // TODO: Get candidate's info

    // Generate QR Code
    const generatedQrCode = this.generateQrCode({ pkId: "YA-W69W", reference });

    if (generatedQrCode) {
      // TODO: Pass candidate's info to buildCardRecto
      // TODO: Add QR Code and candidate's info on recto and save into tmp under `reference` dir
      this.buildCardRecto({ reference }, lang).then(async () => {
        // TODO: Assemble card's recto and verso
        readdir(this._cardsDir).then((content) => {
          let tries = 3;
          let exit = false;

          const interval = setInterval((): void => {
            tries -= 1;
            this.assembleCard(
              reference,
              path.join(this._cardsDir, `${reference}-recto.png`),
              lang
            ).then(() => {
              exit = true;
            });
            if (exit || tries < 1) clearInterval(interval);
          }, 1500);
        });
      });

      // TODO: Upload card to cloudinary and save path to DB(Payment)

      // TODO: Uncomment here
      //  Remove tmp files
      //   unlink(path.join(this._cardsDir, `${reference}.png`));
      //   unlink(path.join(this._cardsDir, `${reference}-recto.png`));
      //   unlink(path.join(this._qrCodesDir, `${reference}.png`));
    }
  }

  /**
   * Generate QR Code and save it to `this.qrCodesDir/${reference}.png`
   *
   * @param {{ data: any; reference: string }} { data, reference }
   * @return {true | undefined}
   * @memberof CardsServices
   */
  private generateQrCode({
    pkId,
    reference,
  }: {
    pkId: string;
    reference: string;
  }): true | undefined {
    try {
      logger.info("Generating qr code for: " + reference + "...");
      const dest = path.join(this._qrCodesDir, `${reference}.png`);

      qr.toFile(dest, pkId, { width: 450 }, async function (err) {
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
  private async buildCardRecto(data: { reference: string }, lang: "en" | "fr") {
    const { reference } = data;

    logger.info(`Generating card recto for ${reference}...`);

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

    // Load recto and qrCode onto canvas
    const img = await loadImage(recto);
    const qr = await loadImage(qrCode);
    ctx.drawImage(img, 0, 0);

    // Overlay the QR Code
    ctx.drawImage(qr, 65, 1160);

    ctx.textAlign = "center";

    // Set text properties and add text
    // Lastname
    this.insertText(ctx, "ABDEL-KALIF", {
      left: lang == "en" ? 445 : 405,
      top: 676,
    });
    // Firstname
    this.insertText(ctx, "BEN HAMADOU", {
      left: lang == "en" ? 580 : 520,
      top: 745,
    });
    // City
    this.insertText(ctx, "Douala", { left: 355, top: 813 });
    // Phone
    this.insertText(ctx, "+237656144663", {
      left: lang == "en" ? 480 : 410,
      top: 880,
    });
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
        logger.error("Error writing image:", err);
      } else {
        logger.info("Done");
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

  /**
   * Assemble card's recto and verso
   *
   * @private
   * @param {string} rectoPath
   * @param {("en" | "fr")} [lang="fr"]
   * @memberof CardsServices
   */
  private async assembleCard(
    reference: string,
    rectoPath: string,
    lang: "en" | "fr" = "fr"
  ) {
    logger.info(`Assembling recto and verso for: ${reference}...`);

    const versoPath = path.join(
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
    const output = path.join(
      __dirname,
      "..",
      "tmp",
      "cards",
      `${reference}.png`
    );
    try {
      // Get metadata of the images
      const MODEL_WIDTH = 1083;

      // Resize images and extend with white background
      const [data1, data2] = await Promise.all([
        sharp(rectoPath)
          .resize(Math.round((MODEL_WIDTH as number) * 0.8))
          .extend({
            bottom: margin,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .toBuffer(),
        sharp(versoPath)
          .resize(Math.round((MODEL_WIDTH as number) * 0.8))
          .extend({
            top: margin / 2,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .toBuffer(),
      ]);

      const recto = await sharp(data1).metadata();
      const verso = await sharp(data2).metadata();

      // Combine images vertically with specified margin
      await sharp({
        create: {
          width: Math.round((MODEL_WIDTH as number) * 0.8),
          height: (recto.height as number) + (verso.height as number) + margin,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .composite([
          { input: data1, top: 0, left: 0 },
          {
            input: data2,
            top: (recto.height as number) + margin / 2,
            left: 0,
          },
        ])
        .toFile(output);
      logger.info("Done");
    } catch (err) {
      logger.error("Error processing images:", err);
    }
  }
}
