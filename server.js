import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";

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

// app.get("/", (rep, resp) => {});

app.post("/signin", (req, resp) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            resp.json(user[0]);
          })
          .catch((err) => resp.status(400).json("unable to get user"));
      } else {
        resp.status(400).json("wrong credentials");
      }
    })
    .catch((err) => resp.status(400).json("wrong credentials"));
});

app.post("/register", (req, resp) => {
  const { email, password, name } = req.body;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            resp.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    resp.status(400).json("Unable to register.");
  });
});

app.get("/profile/:id", (req, resp) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        resp.json(user[0]);
      } else {
        resp.status(400).json("user not found");
      }
    })
    .catch((err) => resp.status(400).json("Problem getting user"));
});

app.put("/image", (req, resp) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      resp.json(entries[0].entries);
    })
    .catch((err) => {
      resp.status(400).json("unable to get entries");
    });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
