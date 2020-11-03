import { Router } from "express";
const router = Router();
import { CronJob } from "cron";

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
  assignCategory,
  removeDiscountByCategoria
} from "../controllers/product.controllers";

//Routes
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
router.get("/descuento/remove/:categoria", removeDiscountByCategoria); //Elimina el descuento de las prendas segun la categoria

router.get("/descuento/moveItems", moveItemsDescuento);

router.get("/descuento/set30Cientox3Meses", setDescuento30xCientoRopa3Meses);
router.get("/descuento/reset30Cientox3Meses", resetDescuento30xCiento3Meses);

//Jobs
var job_AddOriginalPrice = new CronJob(
  "0 1 * * *",
  setOriginalPriceItem,
  null,
  true,
  "America/Tegucigalpa"
);
var job_AddOriginalDescription = new CronJob(
  "30 1 * * *",
  setOriginalDescriptionItem,
  null,
  true,
  "America/Tegucigalpa"
);
var job_AddDiscountField = new CronJob(
  "0 2 * * *",
  addDiscountField,
  null,
  true,
  "America/Tegucigalpa"
);
var job_AddStatusDiscountField = new CronJob(
  "30 2 * * *",
  addStatusDiscountField,
  null,
  true,
  "America/Tegucigalpa"
);
job_AddOriginalPrice.start();
job_AddOriginalDescription.start();
job_AddDiscountField.start();
job_AddStatusDiscountField.start();

export default router;
