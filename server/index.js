import express from "express";
import cors from "cors";
import { variables } from "./config.js";
import routes from "./routes/index.js";
const app = express();

app.use(cors());
app.use("/api/v1", routes);

app.listen(variables.PORT, () => {
  console.log("Server is running on PORT", variables.PORT);
});
