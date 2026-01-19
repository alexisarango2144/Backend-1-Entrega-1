import express from "express";
import ProductManager from "./managers/ProductManager.js";
import CartManager from "./managers/CartManager.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.listen(port, ()=> console.log(`Server running on port ${port}`));
