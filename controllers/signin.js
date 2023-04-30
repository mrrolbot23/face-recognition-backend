const handleSignin = (req, resp, bcrypt, db) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return resp.status(400).json("no empty field allowed");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            resp.json(user[0]);
          })
          .catch((err) => resp.status(400).json("unable to get user"));
      } else {
        resp.status(400).json("wrong credentials");
      }
    })
    .catch((err) => resp.status(400).json("wrong credentials"));
};

export default handleSignin;
