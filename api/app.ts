import { config } from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { DatabaseService } from "./services/database.service";
import authRoutes from "./auth/auth.routes";
import { errorHandler } from "./error/error.handler";

const app: Express = express();
config();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});
app.use(errorHandler);

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
