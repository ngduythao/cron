import express from "express";
import logger from "morgan";
import { envConfig } from "@config/config";

export const app = express();
app.set("port", envConfig.port || 3000);
app.use(logger("dev"));
