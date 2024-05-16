import { ResultSetHeader } from "mysql2";

import { pool } from "../lib/database";
import { CreateNotification } from "../models/notification-model";

const NotificationRepository = {
  createNotification: async (createNotification: CreateNotification) => {
    const query = `INSERT
    INTO
    notifications(
      order_id,
      user_id,
      notification_type
    )
  VALUES (
    ${createNotification.order_id},
    ${createNotification.user_id},
    '${createNotification.notification_type}'
  )`;

    const result = await pool.query<ResultSetHeader>(query);

    return result[0].insertId;
  },
};

export { NotificationRepository };
