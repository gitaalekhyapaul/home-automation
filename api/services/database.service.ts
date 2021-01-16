import * as MongoDB from "mongodb";
import { errors } from "../error/error.constants";

export class DatabaseService {
  private static instance: DatabaseService;
  private dbClient: MongoDB.MongoClient = new MongoDB.MongoClient(
    process.env.MONGO_URI!,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  private constructor() {}

  /**
   * Initializes the database client instance
   * @returns {Promise<void>} Returns a promise which resolves when the database is successfully connected.
   */
  public initalize = async (): Promise<void> => {
    try {
      await this.dbClient.connect();
      console.info("Connected to MongoDB");
    } catch (err) {
      console.error("%o", err);
      console.error("Could not connect to MongoDB");
      throw errors.MONGODB_CONNECT_ERROR;
    }
  };

  /**
   * Singleton function to get the database instance
   * @returns {DatabaseService} Returns the database instance
   */
  public static getInstance = (): DatabaseService => {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  };

  /**
   * Returns the Collection Instance of the given database
   * @param {string} collection The Collection Name
   * @returns {MongoDB.Collection} The instance
   */
  public getDb = async (collection: string): Promise<MongoDB.Collection> => {
    return this.dbClient.db().collection(collection);
  };
}
