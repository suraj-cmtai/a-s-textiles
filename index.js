const express = require("express");
const bodyParser = require("body-parser");
const { notFoundResponse } = require("./utils/responseManager");
const cors = require("cors");

// Routes
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const port = 3000;

app.use(cors());
// Middleware
app.use(bodyParser.json());


app.use("/v1/contacts", contactRoutes);

// Catch all route for 404 (route not found)
app.use((req, res) => {
  notFoundResponse(res, "Route not found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports = app;        



