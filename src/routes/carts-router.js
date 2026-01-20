import { Router } from "express";
import { cartManager } from "../managers/CartManager.js";

const router = Router();

/**
 * POST Crear carrito
 */
router.post("/", async (req, res) => {
    try {
        const {productId, quantity } = req.body || {};

        if (productId) {
            const newCart = await cartManager.addCart(productId, quantity || 1);
            res.json(newCart);
        } else {
            const newCart = await cartManager.addCart();
            res.json(newCart);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * GET Carrito por ID
 */
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        // Traer solo los productos dentro del carrito
        const cart = await cartManager.getProductsInCartById(id);

        // Retornar el carrito completo con los productos
        // const cart = await cartManager.getCartById(id);
        res.json(cart);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * POST Agregar producto al carrito
 */
router.post('/:cid/product/:pid', async (req, res)=>{
    try {
        const {cid, pid } = req.params;
        const {quantity} = req.body || 1;
        const newCart = await cartManager.addProdToCart(cid, pid, quantity);
        res.json(newCart);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

export default router;