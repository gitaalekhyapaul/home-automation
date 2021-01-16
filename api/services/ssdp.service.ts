import { Client } from "node-ssdp";
import { errors } from "../error/error.constants";

export class SSDPService {
  private static instance: SSDPService;
  private client: Client | null = null;
  private constructor() {}

  public initalize = async (): Promise<void> => {
    try {
      this.client = new Client();
      console.info("Initialized SSDP Client");
    } catch (err) {
      console.error("%o", err);
      console.error("Could not initialize SSDP client");
      throw {
        httpStatus: 500,
        message: "Could not initialize SSDP client",
      };
    }
  };

  public static getInstance = (): SSDPService => {
    if (!SSDPService.instance) {
      SSDPService.instance = new SSDPService();
    }
    return SSDPService.instance;
  };

  public getClient = () => this.client;
}
