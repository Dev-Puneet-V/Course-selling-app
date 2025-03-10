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

const allowedOrigins = [
  "http://localhost:5173",
  "https://course-selling-app-rho.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

// Cookie settings middleware
app.use((req, res, next) => {
  res.cookie("token", req.cookies.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "production" ? ".vercel.app" : "localhost",
  });
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api/v1", routes);
app.listen(variables.PORT, () => {
  console.log("Server is running on PORT", variables.PORT);
});
