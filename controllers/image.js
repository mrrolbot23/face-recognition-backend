import * as dotenv from "dotenv";
dotenv.config();

const handleApiCall = (req, resp) => {
  const PAT = process.env.APP_PAT;
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = process.env.USER_ID;
  const APP_ID = process.env.APP_ID;
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "face-detection";
  const IMAGE_URL = req.body.input;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
  fetch(
    "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    requestOptions
  )
    .then((response) => response.json())
    .then((results) => resp.json(results))
    .catch((err) => resp.status(400).json("unable to work with api"));
};

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

export { handleApiCall, handleImage };
