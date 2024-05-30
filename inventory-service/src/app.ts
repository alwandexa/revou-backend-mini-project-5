import express from "express";
import morgan from "morgan";

import inventoryRouter from "./routes/inventory-router";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(inventoryRouter);

export default app;
