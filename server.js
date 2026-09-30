const express = require("express");
const { sequelize } = require("./models");

const app = express();

const path = require("path");

const methodOverride = require("method-override");

// View engine + static files (CSS and uploaded images)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Body parsing (keep your existing express.json() if it's already there)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lets HTML forms send PUT/DELETE via ?_method=PUT
app.use(methodOverride("_method"));

// Content negotiation helper (req.wantsJson, res.respond)
app.use(require("./middleware/respond"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // for CSS + uploaded images
app.use(express.json());

app.use("/galaxies", require("./routes/galaxies"));
app.use("/stars", require("./routes/stars"));
app.use("/planets", require("./routes/planets"));

const PORT = process.env.PORT || 8080;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () =>
    console.log(`Star Tracker API listening on port ${PORT}`),
  );
});
