const express = require("express");
const app = express();
const path = require("path");
const config = require("config");
const mongoose = require("mongoose");

const authRout = require("./routes/authRout");
const linkRout = require("./routes/linkRoutes");
app.use(express.json({ extended: true }));
app.use("/api/auth", authRout);
app.use("/api/link", linkRout);
app.use("/t", require("./routes/redirectRout"));

if (process.env.NODE_ENV === production) {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`'hi server port- ${PORT}'`);
    });
  } catch (e) {
    console.log("servError", e.message);
    process.exit(1);
  }
}

start();
