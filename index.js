const express = require("express");
const path = require("path");
const error = require("./src/utilityFuncs/error");
const ejs = require("ejs");

const app = express();
const PORT = 3000;

const reference = require("./src/routes/reference");
// const user = require("./routes/user");
// const warband = require("./routes/warband");

// Middleware
app.use(express.static("./styles"));
app.use(express.static("./public"));

app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  next();
});

// View Engine
app.engine("ejs", ejs.renderFile);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/api/reference", reference);
app.use("/api/warbands", warband);
// app.use("/api/users", users);

// Routes
app.get("/", (req, res) => {
  const data = {
    contentEJS: "home",
  };
  res.render("index", data);
});

// Last Resort Error handling
app.use((req, res, next) => {
  const data = {
    title: "404 Error",
    imgSrc: "https://media.tenor.com/fRwU2Z3GKtgAAAAM/busy-working.gif",
    content: "You have found a page that does not exist. Please try again.",
  };
  res.status(404).render("page404", data);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
