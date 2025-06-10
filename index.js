const express = require("express");
const bodyParser = require("body-parser");
const { notFoundResponse } = require("./utils/responseManager");
const cors = require("cors");

// Routes
const contactRoutes = require("./routes/contactRoutes");
const productRoutes = require("./routes/productRoutes");
const productLeadsRoutes = require("./routes/productLeadsRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = 3000;

app.use(cors());
// Middleware
app.use(bodyParser.json());

app.use(express.json());
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});


app.use("/v1/contacts", contactRoutes);
app.use("/v1/products", productRoutes);
app.use("/v1/product-leads", productLeadsRoutes);
app.use("/v1/auth", authRoutes);
// Catch all route for 404 (route not found)
app.use((req, res) => {
  notFoundResponse(res, "Route not found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports = app;        



