import express, { Application } from "express";
import cors from "cors";
import RequestHandler from "./api";
import { errorHandler } from "./middlewares/Error";
import "reflect-metadata";
import "es6-shim";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);

RequestHandler(app);

app.listen(process.env.PORT || 9001, () => {
  console.log(`🚀️ Server is running on port ${process.env.PORT || 9001}`);
});
