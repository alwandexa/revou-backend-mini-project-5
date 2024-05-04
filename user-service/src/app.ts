import express from "express";
import morgan from "morgan";

import userRouter from "./routes/user-router";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(userRouter);

export default app;
