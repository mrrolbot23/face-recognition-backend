import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
// FAKE DATABASE
const database = {
  users: [
    {
      id: "123",
      name: "Edwin",
      email: "edwin@email.com",
      password: "password",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Juan",
      email: "Juan@email.com",
      password: "password1",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "125",
      name: "Jose",
      email: "Jose@email.com",
      password: "password2",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (rep, resp) => {
  // resp.json(database.users);
});

app.post("/signin", (req, resp) => {
  // bcrypt.compare("B4c0//", hash, function (err, res) {
  //   // res === true
  // });
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    resp.json(database.users[0]);
  } else {
    resp.status(400).json("oh no! Try again");
  }
});

app.post("/register", (req, resp) => {
  const { email, password, name } = req.body;
  // bcrypt.genSalt(10, function (err, salt) {
  //   bcrypt.hash(password, salt, function (err, hash) {
  //     console.log(hash);
  //   });
  // });
  database.users.push({
    id: "134",
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });

  resp.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, resp) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return resp.json(user);
    }
  });
  if (!found) {
    resp.status(400).json("user not found");
  }
});

app.put("/image", (req, resp) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return resp.json(user.entries + 1);
    }
  });
  if (!found) {
    resp.status(400).json("user not found");
  }
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
