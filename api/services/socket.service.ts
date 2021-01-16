import { Server } from "http";
import { Server as socketIOServer } from "socket.io";
import { errors } from "../error/error.constants";

export class SocketService {
  private static instance: SocketService;
  private io: socketIOServer | null = null;
  private constructor() {}

  public initalize = async (expressServer: Server): Promise<socketIOServer> => {
    try {
      this.io = new socketIOServer(expressServer);
      console.info(`Connected to Socket.IO on Port ${process.env.PORT}`);
      return this.io;
    } catch (err) {
      console.error("Could not connect to Socket.IO Server");
      console.error("SocketIOError\n%o", { error: err });
      throw errors.SOCKETIO_CONNECT_ERROR;
    }
  };

  public static getInstance = (): SocketService => {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
      return SocketService.instance!;
    }
    return SocketService.instance!;
  };
  public getIO = (): socketIOServer => {
    return this.io!;
  };
}
