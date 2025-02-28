import express from "express";
import cors from "cors";
import { variables, dbConnect } from "./utils/config";
import routes from "./routes/index";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
app.use(cors());
app.use("/api/v1", routes);

app.listen(variables.PORT, () => {
  console.log("Server is running on PORT", variables.PORT);
});
