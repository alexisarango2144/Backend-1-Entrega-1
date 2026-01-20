import { Router } from "express";
import { productsManager } from "../managers/ProductManager.js";

const router = Router();

/**
 * GET All products
 */
router.get("/", async (req, res) => {
  try {
    const products = await productsManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * GET Product by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productsManager.getProductById(id);
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * POST Crear producto
 */
router.post("/", async (req, res) => {
  try {
    const newProduct = await productsManager.addProduct(req.body);
    console.log(req.body)
    res.json(newProduct);
  } catch (error) {
    res.status(500).send(error.message + " " + req.body);
  }
});

/**
 * PUT Actualizar producto
 */
router.put("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const product = await productsManager.updateProductById(id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * DELETE Eliminar producto
 */
router.delete("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    
    /* Soft Delete */
    // const response = await productsManager.softDeleteProduct(id); 
    
    /* Hard Delete */
    const response = await productsManager.hardDeleteProduct(id); 
    res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
