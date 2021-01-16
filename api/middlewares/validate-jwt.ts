import { verify } from "jsonwebtoken";
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { errors } from "../error/error.constants";

export const JwtRequestSchema = yup
  .object({
    authorization: yup
      .string()
      .trim()
      .min(1, "JWT cannot be null")
      .matches(/^Bearer .+$/, "JWT should be Bearer Token"),
  })
  .required();

export interface jwtPayload {
  email: string;
}

type JwtRequest = yup.InferType<typeof JwtRequestSchema>;

/**
 * JWT Validation Middleware
 * @param {boolean} checkRequired Is the JWT check mandatory?
 */
export const validateJwt = (checkRequired: boolean = true) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers as JwtRequest;
      if (!authorization) {
        if (!checkRequired) {
          return next();
        } else {
          return next(errors.JWT_ERROR);
        }
      }
      const authToken = authorization.split(" ")[1];
      const payload: jwtPayload = verify(authToken, process.env.JWT_SECRET!, {
        issuer: "gitaalekhyapaul",
      }) as jwtPayload;
      res.locals.user = payload;
      next();
    } catch (err) {
      next({
        httpStatus: 403,
        message: `${err.name}: ${err.message}`,
      });
    }
  };
};
