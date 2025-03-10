import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { variables, dbConnect } from "./utils/config";
import routes from "./routes/index";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
app.use(
  cors({
    origin: variables.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api/v1", routes);
app.listen(variables.PORT, () => {
  console.log("Server is running on PORT", variables.PORT);
});
