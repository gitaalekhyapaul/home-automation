import { config } from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { join } from "path";
import { DatabaseService } from "./services/database.service";
import { SSDPService } from "./services/ssdp.service";
import { SocketService } from "./services/socket.service";
import authRoutes from "./auth/auth.routes";
import deviceRoutes from "./device/device.routes";
import { describeDevice } from "./device/device.service";
import { errorHandler } from "./error/error.handler";
import { Server } from "http";
import { Socket } from "socket.io";

const app: Express = express();
config();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "..", "views"));

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/device", deviceRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "..", "public")));
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.render("index", {});
  });
  app.get("/dashboard", (req: Request, res: Response, next: NextFunction) => {
    res.render("dashboard", {});
  });
}

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});
app.use(errorHandler);

Promise.all([
  DatabaseService.getInstance().initalize(),
  SSDPService.getInstance().initalize(),
])
  .then(() => {
    return app.listen(process.env.PORT, () => {
      console.log(
        `Express:${process.env.NODE_ENV} listening on Port ${process.env.PORT}`
      );
    });
  })
  .then((expressServer: Server) => {
    return SocketService.getInstance().initalize(expressServer);
  })
  .then(async (socketServer) => {
    socketServer.on("connection", (socket: Socket) => {
      console.log(`${socket.id} has connected.`);
    });
    const client = await SSDPService.getInstance().getClient();
    client!.on("response", async (headers, statusCode, rinfo) => {
      console.dir(headers);
      console.dir(statusCode);
      console.dir(rinfo);
      const deviceDescription = await describeDevice(
        headers.ST!,
        headers.USN!,
        headers.LOCATION!
      );
      socketServer.sockets.emit("new-device", deviceDescription);
    });
  })
  .catch((err) => {
    console.error("%o", err);
    process.exit(1);
  });
