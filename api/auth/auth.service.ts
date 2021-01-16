import { DatabaseService } from "../services/database.service";
import { errors } from "../error/error.constants";
import { hash } from "bcrypt";

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
