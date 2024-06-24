import axios from "axios";
import config from "../../config";
import CryptoJS from "crypto-js";
import { INTOUCH_PROVIDER, PROVIDER } from "../../utils/constants/payments";
import { Service } from "typedi";

@Service()
export default class IntouchServices {
  private uri = config.INTOUCH_URI;
  private _username = config.INTOUCH_USERNAME;
  private _pwd = config.INTOUCH_PWD;
  private _callback = config.INTOUCH_CALLBACK;

  private async getDigest() {
    return axios.get(this.uri).catch((error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.headers["www-authenticate"]
      ) {
        // Parse the WWW-Authenticate header
        const authHeader = error.response.headers["www-authenticate"];
        const authParams: any = {};
        authHeader.replace(
          /(\w+)="([^"]+)"/g,
          (match: any, key: string, value: any) => {
            authParams[key] = value;
          }
        );

        // Prepare the HA1, HA2, and response hash
        const ha1 = CryptoJS.MD5(
          `${this._username}:${authParams.realm}:${this._pwd}`
        ).toString();
        const ha2 = CryptoJS.MD5(`GET:${authParams.uri}`).toString();
        const response = CryptoJS.MD5(
          `${ha1}:${authParams.nonce}:00000001:${authParams.cnonce}:${authParams.qop}:${ha2}`
        ).toString();

        // Prepare the Authorization header
        const authHeaderDigest = `Digest username="${this._username}", realm="${authParams.realm}", nonce="${authParams.nonce}", uri="${authParams.uri}", qop=${authParams.qop}, nc=00000001, cnonce="${authParams.cnonce}", response="${response}", opaque="${authParams.opaque}"`;

        return authHeaderDigest;
      }
    });
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

    return axios
      .post(
        this.uri,
        {
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
            provider === PROVIDER.OM
              ? INTOUCH_PROVIDER.OM
              : INTOUCH_PROVIDER.MOMO,
        },
        {
          headers: {
            Authorization: digest,
          },
        }
      )
      .then((response: any) => {
        const { idFromGU: reference } = response;

        return { reference: reference as string };
      })
      .catch((error) => {
        throw error;
      });
  }
}
