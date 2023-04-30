import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";
import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfile from "./controllers/profile.js";
import { handleApiCall, handleImage } from "./controllers/image.js";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "",
    password: "",
    database: "face-recon",
  },
});

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

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

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
