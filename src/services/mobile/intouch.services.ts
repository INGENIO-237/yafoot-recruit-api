import axios from "axios";
import config from "../../config";
import crypto from "crypto";
import { INTOUCH_PROVIDER, PROVIDER } from "../../utils/constants/payments";
import { Service } from "typedi";

@Service()
export default class IntouchServices {
  private _uri = config.INTOUCH_URI;
  private _username = config.INTOUCH_USERNAME;
  private _pwd = config.INTOUCH_PWD;
  private _callback = config.INTOUCH_CALLBACK;

  private async getDigest() {
    try {
      // First request to get the WWW-Authenticate header
      await axios.post(this._uri, {}, { validateStatus: (status) => false });
    } catch (error: any) {
      const authHeader = error.response.headers["www-authenticate"] as string;

      if (!authHeader || !authHeader.startsWith("Digest")) {
        throw new Error("Digest authentication headers not found");
      }

      const authParams = authHeader
        .match(/(\w+)="([^"]*)"/g)
        ?.reduce((acc: any, item: string) => {
          const [key, value] = item.split("=");
          acc[key.trim()] = value.replace(/"/g, "").trim();
          return acc;
        }, {});

      if (!authParams) {
        throw new Error("Failed to parse WWW-Authenticate header");
      }

      console.log({ authParams });

      const { realm, nonce, opaque } = authParams;

      const ha1 = crypto
        .createHash("md5")
        .update(`${this._username}:${realm}:${this._pwd}`)
        .digest("hex");
      const ha2 = crypto
        .createHash("md5")
        .update(`PUT:${this._uri}`)
        .digest("hex");
      const response = crypto
        .createHash("md5")
        .update(`${ha1}:${nonce}:${ha2}`)
        .digest("hex");

      const authDigestHeader = `Digest username="${this._username}", realm="${realm}", nonce="${nonce}", uri="${this._uri}", response="${response}", opaque="${opaque}"`;

      // Second request with the Digest authentication header
      // const secondResponse = await axios.put(this._uri, data, {
      //   headers: {
      //     Authorization: authDigestHeader,
      //     "Content-Type": "application/json",
      //     "Content-Length": Buffer.byteLength(JSON.stringify(data)),
      //   },
      //   httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }), // Disable SSL verification
      //   timeout: 30000,
      // });

      return authDigestHeader;
    }
  }

  async initializePayment({
    firstname,
    lastname,
    phone,
    amount,
    provider,
  }: { provider: PROVIDER; amount: number } & {
    firstname?: string;
    lastname: string;
    phone: string;
  }) {
    const digest = (await this.getDigest()) as string;

    if (!digest) {
      throw new Error("Error generating digest");
    }

    console.log({ digest });

    const payload = {
      idFromClient: Date.now(),
      amount,
      additionnalInfos: {
        recipientEmail: "",
        recipientFirstName: firstname,
        recipientLastName: lastname,
      },
      callback: this._callback,
      recipientNumber: phone,
      serviceCode:
        provider === PROVIDER.OM ? INTOUCH_PROVIDER.OM : INTOUCH_PROVIDER.MOMO,
    };

    return axios
      .put(this._uri, payload, {
        headers: {
          Authorization: digest,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(payload)),
        },
        // auth: {
        //   username: this._username,
        //   password: this._pwd,
        // },
      })
      .then((response: any) => {
        const { idFromGU: reference } = response;

        return { reference: reference as string };
      })
      .catch((error) => {
        throw error;
      });
  }
}
