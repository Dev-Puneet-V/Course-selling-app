import dotenv from "dotenv";
dotenv.config();
const variables = {
  PORT: process.env.PORT || 3000,
};

export { variables };
