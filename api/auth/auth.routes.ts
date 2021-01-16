import { Router, Request, Response, NextFunction } from "express";
const router: Router = Router();
import validateQuery from "../middlewares/validate-query";
import { user, userSchema } from "./auth.schema";
import { signup, login } from "./auth.service";

const handlePostSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as user;
    const result = await signup(email, password);
    res.status(201).json({
      success: true,
      message: "User successfully signed-up!",
    });
  } catch (err) {
    next(err);
  }
};

const handlePostLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as user;
    const authToken = await login(email, password);
    res.json({
      success: true,
      authToken,
    });
  } catch (err) {
    next(err);
  }
};

router.post("/signup", validateQuery("body", userSchema), handlePostSignup);
router.post("/login", validateQuery("body", userSchema), handlePostLogin);

export default router;
