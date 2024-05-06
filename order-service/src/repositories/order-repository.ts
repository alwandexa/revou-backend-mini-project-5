import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";

import { CreateUserRequest, UserModel } from "../models/order-model";
import { pool } from "../lib/database";

const UserRepository = {
  createUser: async (userModel: CreateUserRequest) => {
    const query = `INSERT INTO users(email, password, name, role, birthdate) values('${userModel.email}', '${userModel.password}', '${userModel.name}', 'user', '${userModel.birthdate}')`;

    const result = await pool.query<ResultSetHeader>(query);

    return result[0].insertId;
  },
  getByEmail: async (email: string) => {
      const query = `SELECT * FROM users where email = '${email}'`;

      const [rows] = await pool.query<RowDataPacket[]>(query);

      if (rows.length === 0) {
        throw new Error("User not found");
      }

      return rows[0] as UserModel;
  },
};

export { UserRepository };
