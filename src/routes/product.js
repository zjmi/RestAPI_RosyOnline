import { Router } from "express";
const router = Router();

import {
  getAllProduct,
  getProductDetailsByID,
  setOriginalPriceItem,
  setOriginalDescriptionItem,
  setDescuento30xCientoRopa3Meses,
  resetDescuento30xCiento3Meses,
} from "../controllers/product.controllers";

router.get("/", getAllProduct);
router.get("/:ID", getProductDetailsByID);
router.get("/price/setOriginalPrice", setOriginalPriceItem);
router.get("/description/setOriginalDescription", setOriginalDescriptionItem);
router.get("/descuento/set30Cientox3Meses", setDescuento30xCientoRopa3Meses);
router.get("/descuento/reset30Cientox3Meses", resetDescuento30xCiento3Meses);

export default router;
