import { Router } from "express";
const router = Router();

import {
  getAllProduct,
  getProductDetailsByID,
} from "../controllers/product.controllers";

router.get("/", getAllProduct);
router.get("/:ID", getProductDetailsByID);

export default router;
