import express from "express";
import cors from "cors";
import { variables, dbConnect } from "./utils/config.js";
import routes from "./routes/index.js";
const app = express();

dbConnect();
app.use(cors());
app.use("/api/v1", routes);

app.listen(variables.PORT, () => {
  console.log("Server is running on PORT", variables.PORT);
});
