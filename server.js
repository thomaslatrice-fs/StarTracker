const express = require("express");
const { sequelize } = require("./models");

const app = express();
app.use(express.json());

app.use("/galaxies", require("./routes/galaxies"));
app.use("/stars", require("./routes/stars"));
app.use("/planets", require("./routes/planets"));

const PORT = process.env.PORT || 8080;

sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.log(`Star Tracker API listening on port ${PORT}`),
  );
});
