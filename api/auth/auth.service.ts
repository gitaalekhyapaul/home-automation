import { DatabaseService } from "../services/database.service";
import { errors } from "../error/error.constants";
import { hash, compare } from "bcrypt";
import { user } from "./auth.schema";
import { sign } from "jsonwebtoken";

export const signup = async (
  email: string,
  password: string
): Promise<boolean | undefined> => {
  const db = await DatabaseService.getInstance().getDb("home-automation");
  const exists = await db.countDocuments({ email: email });
  if (exists) throw errors.ACCOUNT_EXISTS;
  const hashedPassword = await hash(password, 12);
  const { result } = await db.insertOne({
    email: email,
    password: hashedPassword,
  });
  if (result.ok) return true;
};

export const login = async (
  email: string,
  password: string
): Promise<string | undefined> => {
  const db = await DatabaseService.getInstance().getDb("home-automation");
  const exists = await db.countDocuments({ email: email });
  if (!exists) throw errors.WRONG_CREDS;
  const user = await db.findOne<user>({ email: email });
  const matchPassword = await compare(password, user!.password);
  if (!matchPassword) throw errors.WRONG_CREDS;
  const authToken = await sign({ email: email }, process.env.JWT_SECRET!, {
    issuer: "gitaalekhyapaul",
    expiresIn: "2h",
  });
  return authToken;
};
