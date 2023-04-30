const handleImage = (req, resp, db) => {
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
};

export default handleImage;
