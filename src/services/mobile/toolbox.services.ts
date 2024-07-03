import axios, { AxiosResponse } from "axios";
import config from "../../config";
import { PROVIDER } from "../../utils/constants/payments";
import { Service } from "typedi";

@Service()
export default class ToolBoxServices {
  private _uri = config.TOOLBOX_URI;
  private _apiKey = config.TOOLBOX_API_KEY;

  async initializePayment({
    phone,
    amount,
    provider,
  }: {
    provider: PROVIDER;
    amount: number;
    phone: string;
  }) {
    return axios
      .post(
        this._uri + "/payments/mobile",
        {
          phone,
          amount,
          provider: {
            name: provider,
            country: "CM",
          },
        },
        {
          headers: {
            ["x-api-key"]: this._apiKey,
          },
        }
      )
      .then(
        (
          response: AxiosResponse<{
            reference: string;
            authorization_url: string;
          }>
        ) => response.data
      )
      .catch((error) => {
        throw error;
      });
  }
}
