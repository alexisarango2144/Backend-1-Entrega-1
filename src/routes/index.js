import { Router } from "express";
import productRouter from "./products-router.js";
import cartRouter from "./carts-router.js";

const router = Router();

router.use('/products', productRouter);
router.use('/carts', cartRouter);

export default router;