import { Router, Request, Response, NextFunction } from "express";
const router: Router = Router();
import validateQuery from "../middlewares/validate-query";
import { validateJwt } from "../middlewares/validate-jwt";
import { searchDevices, findDevice, addDevice } from "./device.service";
import { deviceSchema, listDeviceSchema } from "./device.schema";
import { errors } from "../error/error.constants";

const handleGetSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("M-SEARCH QUERY");
    await searchDevices();
    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

const handlePostFind = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { link, urn, uuid } = req.body as deviceSchema;
    const exists = await findDevice(res.locals.user.email, uuid, urn);
    res.json({
      success: true,
      exists,
    });
  } catch (err) {
    next(err);
  }
};

const handlePostAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { link, urn, uuid } = req.body as deviceSchema;
    const success = await addDevice(res.locals.user.email, uuid, urn);
    if (!success) throw errors.BAD_REQUEST;
    res.json({
      success,
    });
  } catch (err) {
    next(err);
  }
};

router.get("/search", validateJwt(true), handleGetSearch);
router.post(
  "/find",
  validateJwt(true),
  validateQuery("body", listDeviceSchema),
  handlePostFind
);
router.post(
  "/add",
  validateJwt(true),
  validateQuery("body", listDeviceSchema),
  handlePostAdd
);

export default router;
