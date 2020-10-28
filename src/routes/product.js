import { Router } from "express";
const router = Router();

import {
  getAllProduct,
  getProductDetailsByID,
  setOriginalPriceItem,
  setOriginalDescriptionItem,
  setDescuento30xCientoRopa3Meses,
  resetDescuento30xCiento3Meses,
  moveItemsDescuento,
  addDiscountField,
  addStatusDiscountField,
  updateDiscount30Percent,
  openStatusDiscount,
  politicasDescuento,
  assignCategory
} from "../controllers/product.controllers";

router.get("/", getAllProduct);
router.get("/:ID", getProductDetailsByID);
router.get("/price/setOriginalPrice", setOriginalPriceItem); //Hace un backup del precio original de todos los productos
router.get("/description/setOriginalDescription", setOriginalDescriptionItem); //Hace un backup de la descripcion de todos los productos
router.get("/descuento/addFieldDiscount", addDiscountField); //Agrega el campo descuento a todos los productos
router.get("/descuento/addFieldStatusDiscount", addStatusDiscountField); //Agrega el campo status discount a todos los productos
router.get("/descuento/update30DiscountField", updateDiscount30Percent); //Actualiza el campo discount a los items que ya tenian el 30% de descuento
router.get("/descuento/openStatusDiscount", openStatusDiscount); //Coloca en 1 el status discount en todos los productos
router.get("/descuento/politicaDescuento", politicasDescuento); //Establece las politicas
router.get("/descuento/asignarCategoria", assignCategory); //Asigna las categorias a las prendas con descuento

router.get("/descuento/moveItems", moveItemsDescuento);

router.get("/descuento/set30Cientox3Meses", setDescuento30xCientoRopa3Meses);
router.get("/descuento/reset30Cientox3Meses", resetDescuento30xCiento3Meses);

export default router;
