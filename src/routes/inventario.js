import { Router } from "express";
const router = Router();

import { getSku, sp_reduce_stock } from "../controllers/inventario.controllers";

router.get("/sku/:referencia", getSku);

router.post("/reduceStock", sp_reduce_stock);

export default router;
