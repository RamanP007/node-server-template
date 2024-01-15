import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
} from "express";
import cors from "cors";
import RequestHandler from "./api";
import "reflect-metadata";
import "es6-shim";
import listEndpoints from "express-list-endpoints";
import "./db.config";
import { globalErrorHandler } from "./middlewares/Error";
import cookieParser from "cookie-parser";
import "./redis.config";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

RequestHandler(app);
app.use(globalErrorHandler);
console.log(listEndpoints(app as express.Express));

app.listen(process.env.PORT || 9001, () => {
  console.log(`🚀️ Server is running on port ${process.env.PORT || 9001}`);
});
