import { config } from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { DatabaseService } from "./services/database.service";

const app: Express = express();
config();

app.use(express.json());
app.use(cors());

Promise.all([DatabaseService.getInstance().initalize()])
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Express:${process.env.NODE_ENV} listening on Port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("%o", err);
    process.exit(1);
  });
