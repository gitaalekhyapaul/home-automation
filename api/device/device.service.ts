import { SSDPService } from "../services/ssdp.service";
import { DatabaseService } from "../services/database.service";
import { deviceSchema } from "./device.schema";
import { errors } from "../error/error.constants";
import Axios from "axios";
import { parseStringPromise } from "xml2js";
import { userSchema } from "../auth/auth.schema";

export const searchDevices = async () => {
  const client = await SSDPService.getInstance().getClient();
  client!.search("urn:schemas-upnp-org:device:ESP8266:1");
};

export const findDevice = async (
  email: string,
  uuid: string,
  urn: string
): Promise<boolean> => {
  const db = await DatabaseService.getInstance().getDb("home-automation");
  const user = await db.findOne<{
    email: string;
    devices: Array<deviceSchema>;
  }>({ email: email });
  const deviceExists = user!.devices.findIndex(
    (p) => p.uuid === uuid && p.urn === urn
  );
  if (deviceExists === -1) return false;
  else return true;
};

export const addDevice = async (
  email: string,
  uuid: string,
  urn: string
): Promise<boolean> => {
  const db = await DatabaseService.getInstance().getDb("home-automation");
  const { result } = await db.updateOne(
    { email: email },
    {
      $push: {
        devices: { uuid, urn },
      },
    }
  );
  if (result.ok) return true;
  else return true;
};

export const describeDevice = async (
  urn: string,
  uuid: string,
  descriptionLink: string
) => {
  try {
    const { data } = await Axios.get(descriptionLink);
    const deviceDescription = await parseStringPromise(data);
    return {
      urn,
      uuid,
      link: deviceDescription.root.URLBase[0],
      name: deviceDescription.root.device[0].friendlyName[0],
      modelNumber: deviceDescription.root.device[0].modelNumber[0],
    };
  } catch (err) {
    console.dir(err);
  }
};
