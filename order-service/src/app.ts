import express from "express";
import morgan from "morgan";

import orderRouter from "./routes/order-router";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(orderRouter);

export default app;
