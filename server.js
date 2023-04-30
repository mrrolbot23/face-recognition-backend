import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";
import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfile from "./controllers/profile.js";
import { handleApiCall, handleImage } from "./controllers/image.js";
import * as dotenv from "dotenv";
dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, resp) => {
  resp.send("App is working!");
});

app.post("/signin", (req, resp) => {
  handleSignin(req, resp, bcrypt, db);
});

app.post("/register", (req, resp) => {
  handleRegister(req, resp, bcrypt, db);
});

app.get("/profile/:id", (req, resp) => {
  handleProfile(req, resp, db);
});

app.put("/image", (req, resp) => {
  handleImage(req, resp, db);
});

app.post("/imageUrl", (req, resp) => {
  handleApiCall(req, resp);
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
