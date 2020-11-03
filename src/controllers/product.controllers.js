import { sequelize } from "../database/database";
import Sequelize from "sequelize";

export async function getAllProduct(req, res) {
  try {
    const query =
      "SELECT * " +
      "FROM  wp_j8dwsram9m_posts " +
      'WHERE  post_type =  "product" ' +
      'AND  post_status =  "publish"';

    const inventario = await sequelize.query(query, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    res.json({
      data: inventario,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getProductDetailsByID(req, res) {
  try {
    const { ID } = req.params;
    const productoQuery =
      `SELECT * ` + `FROM wp_j8dwsram9m_posts ` + `WHERE ID = ${ID}`;

    const producto = await sequelize.query(productoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });

    const productoDetailsQuery =
      `SELECT * ` + `FROM  wp_j8dwsram9m_postmeta ` + `WHERE post_id = ${ID}`;

    const productoDetails = await sequelize.query(productoDetailsQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json({
      data: {
        producto: producto,
        detalles: productoDetails,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function setOriginalDescriptionItem(req, res) {
  try {
    let contador = 1;
    let itemDescriptionInsert = 0;
    //Bloque que busca las prendas
    const productoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = '_price'`;

    const productos = await sequelize.query(productoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    //------------------------------------------
    if (productos) {
      productos.map(async (item) => {
        //Bloque que busca la _original_description de cada item
        const originalDescriptionQuery =
          `SELECT meta_id, post_id, meta_key, meta_value ` +
          `FROM  wp_j8dwsram9m_postmeta ` +
          `WHERE  meta_key = "_original_description" AND post_id = ${item.ID}`;
        const originalDescriptionItem = await sequelize.query(
          originalDescriptionQuery,
          {
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.SELECT,
          }
        );
        //---------------------------
        if (originalDescriptionItem.length > 0) {
          console.log(
            `Ya existe la '_original_description' del registro con ID: ${item.ID}`
          );
        } else {
          //Bloque que inserta la '_original_description' de la prenda
          const originalDescriptionInsertQuery =
            `INSERT INTO wp_j8dwsram9m_postmeta ( ` +
            `post_id, ` +
            `meta_key, ` +
            `meta_value ` +
            `) ` +
            `VALUES ( ` +
            `${item.ID}, '_original_description', "${item.post_content}" ` +
            `)`;
          const originalDescriptionInsert = await sequelize.query(
            originalDescriptionInsertQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.INSERT,
            }
          );
          //-----------------------------------------------
          if (originalDescriptionInsert) {
            console.log(
              `Se inserto la '_original_description' del registro con ID: ${item.ID}`
            );
            itemDescriptionInsert = itemDescriptionInsert + 1;
          } else {
            console.log(
              `Error: No se pudo insertar la '_original_description' del registro con ID: ${item.ID}`
            );
          }
        }
        if (contador === productos.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se inserto la '_original_description' de ${itemDescriptionInsert} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se esta ejecutando el proceso en segundo plano");
    } else {
      res.json("No existen productos");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function setOriginalPriceItem(req, res) {
  try {
    let contador = 1;
    let itemPrecioInsert = 0;
    //Bloque que busca las prenda
    const productoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = '_price'`;

    const productos = await sequelize.query(productoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    //------------------------------
    if (productos) {
      productos.map(async (item) => {
        //Bloque que busca el _original_price de cada item
        const originalPriceQuery =
          `SELECT meta_id, post_id, meta_key, meta_value ` +
          `FROM  wp_j8dwsram9m_postmeta ` +
          `WHERE  meta_key = "_original_price" AND post_id = ${item.ID}`;
        const originalPriceItem = await sequelize.query(originalPriceQuery, {
          plain: false,
          raw: false,
          type: Sequelize.QueryTypes.SELECT,
        });
        //---------------------------
        if (originalPriceItem.length > 0) {
          console.log(
            `Ya existe el '_original_price' del registro con ID: ${item.ID}`
          );
        } else {
          //Bloque que inserta el '_original_price' de la prenda
          const originalPriceInsertQuery =
            `INSERT INTO wp_j8dwsram9m_postmeta ( ` +
            `post_id, ` +
            `meta_key, ` +
            `meta_value ` +
            `) ` +
            `VALUES ( ` +
            `${item.ID}, '_original_price', '${item.meta_value}' ` +
            `)`;
          const originalPriceInsert = await sequelize.query(
            originalPriceInsertQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.INSERT,
            }
          );
          //-----------------------------------------------
          if (originalPriceInsert) {
            console.log(
              `Se inserto el '_original_price' del registro con ID: ${item.ID}`
            );
            itemPrecioInsert = itemPrecioInsert + 1;
          } else {
            console.log(
              `Error: No se pudo insertar el '_original_price' del registro con ID: ${item.ID}`
            );
          }
        }

        if (contador === productos.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se inserto el '_original_price' de ${itemPrecioInsert} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se esta ejecutando el proceso en segundo plano");
    } else {
      res.json("No existen productos");
    }
  } catch (error) {
    console.log(error);
  }
}

//Funcion que agrega el campo "_discount" en cada producto
export async function addDiscountField(req, res) {
  try {
    let contador = 1;
    let itemDiscountInsert = 0;
    //Bloque que busca las prenda
    const productoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = '_price'`;

    const productos = await sequelize.query(productoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    //------------------------------
    if (productos) {
      productos.map(async (item) => {
        //Bloque que busca el _discount de cada item
        const discountItemQuery =
          `SELECT meta_id, post_id, meta_key, meta_value ` +
          `FROM  wp_j8dwsram9m_postmeta ` +
          `WHERE  meta_key = "_discount" AND post_id = ${item.ID}`;
        const discountItem = await sequelize.query(discountItemQuery, {
          plain: false,
          raw: false,
          type: Sequelize.QueryTypes.SELECT,
        });
        //---------------------------
        if (discountItem.length > 0) {
          console.log(
            `Ya existe el '_discount' del registro con ID: ${item.ID}`
          );
        } else {
          //Bloque que inserta el '_discount' de la prenda
          const discountItemInsertQuery =
            `INSERT INTO wp_j8dwsram9m_postmeta ( ` +
            `post_id, ` +
            `meta_key, ` +
            `meta_value ` +
            `) ` +
            `VALUES ( ` +
            `${item.ID}, '_discount', '0' ` +
            `)`;
          const discountItemInsert = await sequelize.query(
            discountItemInsertQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.INSERT,
            }
          );
          //-----------------------------------------------
          if (discountItemInsert) {
            console.log(
              `Se inserto el '_discount' del registro con ID: ${item.ID}`
            );
            itemDiscountInsert = itemDiscountInsert + 1;
          } else {
            console.log(
              `Error: No se pudo insertar el '_discount' del registro con ID: ${item.ID}`
            );
          }
        }

        if (contador === productos.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se inserto el '_discount' de ${itemDiscountInsert} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se esta ejecutando el proceso en segundo plano");
    } else {
      res.json("No existen productos");
    }
  } catch (error) {
    res.json(error.message);
  }
}

//Funcion que agrega el campo de "_status_discount" en cada producto
export async function addStatusDiscountField(req, res) {
  try {
    let contador = 1;
    let itemStatusDiscountInsert = 0;
    //Bloque que busca las prenda
    const productoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = '_price'`;

    const productos = await sequelize.query(productoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    //------------------------------
    if (productos) {
      productos.map(async (item) => {
        //Bloque que busca el _status_discount de cada item
        const discountStatusItemQuery =
          `SELECT meta_id, post_id, meta_key, meta_value ` +
          `FROM  wp_j8dwsram9m_postmeta ` +
          `WHERE  meta_key = "_status_discount" AND post_id = ${item.ID}`;
        const discountStatusItem = await sequelize.query(
          discountStatusItemQuery,
          {
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.SELECT,
          }
        );
        //---------------------------
        if (discountStatusItem.length > 0) {
          console.log(
            `Ya existe el '_status_discount' del registro con ID: ${item.ID}`
          );
        } else {
          //Bloque que inserta el '_status_discount' de la prenda
          const discountStatusItemInsertQuery =
            `INSERT INTO wp_j8dwsram9m_postmeta ( ` +
            `post_id, ` +
            `meta_key, ` +
            `meta_value ` +
            `) ` +
            `VALUES ( ` +
            `${item.ID}, '_status_discount', '0' ` +
            `)`;
          const discountStatusItemInsert = await sequelize.query(
            discountStatusItemInsertQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.INSERT,
            }
          );
          //-----------------------------------------------
          if (discountStatusItemInsert) {
            console.log(
              `Se inserto el '_status_discount' del registro con ID: ${item.ID}`
            );
            itemStatusDiscountInsert = itemStatusDiscountInsert + 1;
          } else {
            console.log(
              `Error: No se pudo insertar el '_status_discount' del registro con ID: ${item.ID}`
            );
          }
        }

        if (contador === productos.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se inserto el '_status_discount' de ${itemStatusDiscountInsert} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se esta ejecutando el proceso en segundo plano");
    } else {
      res.json("No existen productos");
    }
  } catch (error) {
    res.json(error.message);
  }
}

//Metodo que cambia el discount a 30 de los que ya tiene descuento
export async function updateDiscount30Percent(req, res) {
  try {
    let contador = 1;
    let itemsChangeDiscount = 0;
    const itemsDescuentoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ON A.ID = B.post_id ` +
      `WHERE A.post_type =  "product" ` +
      `AND A.post_status =  "publish" ` +
      `AND B.meta_key =  '_price' ` +
      `AND A.post_content LIKE  '%DESCUENTO%'`;
    const itemsDescuento = await sequelize.query(itemsDescuentoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    if (itemsDescuento.length > 0) {
      itemsDescuento.map(async (item) => {
        const updateDiscountProductQuery =
          `UPDATE wp_j8dwsram9m_postmeta ` +
          `SET meta_value = '30' ` +
          `WHERE post_id = ${item.ID} AND meta_key = '_discount'`;
        const updateDiscountProduct = await sequelize.query(
          updateDiscountProductQuery,
          {
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.UPDATE,
          }
        );

        if (updateDiscountProduct) {
          console.log(
            "Se actualizo el discount del registro con ID: " + item.ID
          );
          itemsChangeDiscount = itemsChangeDiscount + 1;
        } else {
          console.log(
            "No se pudo actualizar el discount del registro con ID: " + item.ID
          );
        }

        if (contador === itemsDescuento.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se cambio el discount a ${itemsChangeDiscount} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se esta corriendo en segundo plano");
    } else {
      res.json("No existen productos con descuento");
    }
  } catch (error) {
    res.json(error.message);
  }
}

//Metodo que pone a 1 el status discount de los productos
export async function openStatusDiscount(req, res) {
  try {
    let contador = 1;
    let itemStatusDiscountOpen = 0;
    //Bloque que busca las prenda
    const productoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = '_price'`;

    const productos = await sequelize.query(productoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    //------------------------------
    if (productos) {
      productos.map(async (item) => {
        const openStatusDiscountQuery =
          `UPDATE wp_j8dwsram9m_postmeta ` +
          `SET meta_value = '1' ` +
          `WHERE post_id = ${item.ID} AND meta_key = '_status_discount'`;
        const openStatusDiscountItem = await sequelize.query(
          openStatusDiscountQuery,
          {
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.UPDATE,
          }
        );

        if (openStatusDiscountItem) {
          console.log(
            "Se actualizo el status discount del registro con ID: " + item.ID
          );
          itemStatusDiscountOpen = itemStatusDiscountOpen + 1;
        } else {
          console.log(
            "No se pudo actualizar el status discount del registro con ID: " +
              item.ID
          );
        }

        if (contador === productos.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se cambio el status discount a ${itemStatusDiscountOpen} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se esta ejecutando en segundo plano");
    } else {
      res.json("No existen productos");
    }
  } catch (error) {
    res.json(error.message);
  }
}

export async function setDescuento30xCientoRopa3Meses(req, res) {
  try {
    //Bloque que busca las prendas que tengan mas de 90 dias en el inventario (3 Meses)
    const productoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = '_original_price' ` +
      `AND DATEDIFF(NOW(), A.post_date) >= 90`;

    const productoConDescuento = await sequelize.query(productoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    //--------------------------------------------------------------
    if (productoConDescuento) {
      let contador = 1;
      let itemsAplicadoDescuento = 0;
      let itemsChangeDescription = 0;
      productoConDescuento.map(async (item) => {
        //Bloque que actualiza busca el status del stock de la prenda
        const statusStockQuery =
          `SELECT post_id, meta_key, meta_value ` +
          `FROM  wp_j8dwsram9m_postmeta ` +
          `WHERE  post_id = ${item.ID} AND meta_key = '_stock_status'`;
        const statusStockItem = await sequelize.query(statusStockQuery, {
          plain: false,
          raw: false,
          type: Sequelize.QueryTypes.SELECT,
        });
        //---------------------------------
        //Si el status es "instock" se le actualizo el precio con el descuento
        if (statusStockItem[0].meta_value === "instock") {
          //Bloque que busca la _original_description de cada item
          const getOriginalDescriptionQuery =
            `SELECT meta_id, post_id, meta_key, meta_value ` +
            `FROM  wp_j8dwsram9m_postmeta ` +
            `WHERE  meta_key = "_original_description" AND post_id = ${item.ID}`;
          const getOriginalDescription = await sequelize.query(
            getOriginalDescriptionQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.SELECT,
            }
          );
          const originalDescriptionItem = getOriginalDescription[0].meta_value;
          //---------------------------------------------------
          const precioNormal = parseInt(item.meta_value, 10);
          const descuento = precioNormal * 0.3;
          const precioDescuento = Math.round(precioNormal - descuento);
          const precioFinal = precioDescuento.toString();
          // Bloque que actualiza el precio de la prenda
          const updatePriceProductoQuery =
            `UPDATE wp_j8dwsram9m_postmeta ` +
            `SET meta_value = '${precioFinal}' ` +
            `WHERE post_id = ${item.ID} AND meta_key = '_price'`;
          const newProductPrice = await sequelize.query(
            updatePriceProductoQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.UPDATE,
            }
          );
          //-------------------------------------------------
          //Bloque que actualiza la descripcion (post_content y post_excerpt) de la prenda
          const new_post_content =
            `<strong>30% de Descuento</strong>\n` +
            `<strong>Precio Oferta: ${precioFinal}.00L</strong>\n` +
            `<strong>Precio Normal: ${item.meta_value}.00L</strong>\n` +
            `${originalDescriptionItem}`;
          const new_post_excerpt =
            `<h4>30% de Descuento <span style='color: #E25F2E;'>Precio Normal: <del>${item.meta_value}.00L</del></span></h4>\n` +
            `${originalDescriptionItem}`;
          const updateDescriptionProductoQuery =
            `UPDATE wp_j8dwsram9m_posts SET post_content = "${new_post_content}", ` +
            `post_excerpt = "${new_post_excerpt}" ` +
            `WHERE ID = ${item.ID}`;
          const newDescriptionProduct = await sequelize.query(
            updateDescriptionProductoQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.UPDATE,
            }
          );
          //----------------------------------------------------------
          if (newProductPrice) {
            console.log(
              "Se actualizo el precio del registro con ID: " + item.ID
            );
            itemsAplicadoDescuento = itemsAplicadoDescuento + 1;
          } else {
            console.log(
              "No se pudo actualizar el precio del registro con ID: " + item.ID
            );
          }

          if (newDescriptionProduct) {
            console.log(
              "Se actualizo la descripción del registro con ID: " + item.ID
            );
            itemsChangeDescription = itemsChangeDescription + 1;
          } else {
            console.log(
              "No se pudo actualizar la descripción del registro con ID: " +
                item.ID
            );
          }
        }

        if (contador === productoConDescuento.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se cambio el precio a ${itemsAplicadoDescuento} registros`
          );
          console.log(
            `Se cambio la descripción a ${itemsChangeDescription} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se estan aplicando los descuentos");
    } else {
      res.json("No existen productos con mas de 3 meses en el inventario");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function resetDescuento30xCiento3Meses(req, res) {
  try {
    //Bloque que busca las prendas que tengan mas de 90 dias en el inventario (3 Meses)
    const productoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = '_original_price' ` +
      `AND DATEDIFF(NOW(), A.post_date) >= 90`;

    const productoConDescuento = await sequelize.query(productoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    //--------------------------------------------------------------
    if (productoConDescuento) {
      let contador = 1;
      let resetItemsPrice = 0;
      let resetItemsDescription = 0;
      productoConDescuento.map(async (item) => {
        //Bloque que actualiza busca el status del stock de la prenda
        const statusStockQuery =
          `SELECT post_id, meta_key, meta_value ` +
          `FROM  wp_j8dwsram9m_postmeta ` +
          `WHERE  post_id = ${item.ID} AND meta_key = '_stock_status'`;
        const statusStockItem = await sequelize.query(statusStockQuery, {
          plain: false,
          raw: false,
          type: Sequelize.QueryTypes.SELECT,
        });
        //---------------------------------
        //Si el status es "instock" se le actualizo el precio con el descuento
        if (statusStockItem[0].meta_value === "instock") {
          //Bloque que busca la _original_description de cada item
          const getOriginalDescriptionQuery =
            `SELECT meta_id, post_id, meta_key, meta_value ` +
            `FROM  wp_j8dwsram9m_postmeta ` +
            `WHERE  meta_key = "_original_description" AND post_id = ${item.ID}`;
          const getOriginalDescription = await sequelize.query(
            getOriginalDescriptionQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.SELECT,
            }
          );
          const originalDescriptionItem = getOriginalDescription[0].meta_value;
          //---------------------------------------------------
          // Bloque que actualiza el precio de la prenda
          const updatePriceProductoQuery =
            `UPDATE wp_j8dwsram9m_postmeta ` +
            `SET meta_value = '${item.meta_value}' ` +
            `WHERE post_id = ${item.ID} AND meta_key = '_price'`;
          const newProductPrice = await sequelize.query(
            updatePriceProductoQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.UPDATE,
            }
          );
          //-------------------------------------------------
          //Bloque que actualiza la descripcion (post_content y post_excerpt) de la prenda
          const updateDescriptionProductoQuery =
            `UPDATE wp_j8dwsram9m_posts SET post_content = "${originalDescriptionItem}", ` +
            `post_excerpt = "${originalDescriptionItem}" ` +
            `WHERE ID = ${item.ID}`;
          const newDescriptionProduct = await sequelize.query(
            updateDescriptionProductoQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.UPDATE,
            }
          );
          //----------------------------------------------------------
          if (newProductPrice) {
            console.log(
              "Se actualizo al precio original el registro con ID: " + item.ID
            );
            resetItemsPrice = resetItemsPrice + 1;
          } else {
            console.log(
              "No se pudo actualizar al precio original el registro con ID: " +
                item.ID
            );
          }

          if (newDescriptionProduct) {
            console.log(
              "Se actualizo a la descripción original el registro con ID: " +
                item.ID
            );
            resetItemsDescription = resetItemsDescription + 1;
          } else {
            console.log(
              "No se pudo actualizar a la descripción original el registro con ID: " +
                item.ID
            );
          }
        }

        if (contador === productoConDescuento.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se retorno al precio original ${resetItemsPrice} registros`
          );
          console.log(
            `Se retorno a la descripción original ${resetItemsDescription} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se estan estableciendo los valores originales");
    } else {
      res.json("No existen productos con mas de 3 meses en el inventario");
    }
  } catch (error) {
    console.log(error);
  }
}

//Metodo Temporal para copiar los elementos que tienen descuento a una nueva categoria "Descuentos"

export async function moveItemsDescuento(req, res) {
  try {
    let contador = 1;
    let itemCreateCategoryDescuento = 0;
    const itemsDescuentoQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ON A.ID = B.post_id ` +
      `WHERE A.post_type =  "product" ` +
      `AND A.post_status =  "publish" ` +
      `AND B.meta_key =  '_price' ` +
      `AND A.post_content LIKE  '%DESCUENTO%'`;
    const itemsDescuento = await sequelize.query(itemsDescuentoQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    if (itemsDescuento.length > 0) {
      itemsDescuento.map(async (item) => {
        const searchItemCategoryDescuento =
          `SELECT object_id, term_taxonomy_id, term_order ` +
          `FROM wp_j8dwsram9m_term_relationships ` +
          `WHERE object_id = ${item.ID} AND term_taxonomy_id = 1521`;
        const itemCategoryDescuentoExist = await sequelize.query(
          searchItemCategoryDescuento,
          {
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.SELECT,
          }
        );
        if (itemCategoryDescuentoExist.length > 0) {
          console.log(
            `Ya existe la categoria "Descuentos" en el registro con ID ${item.ID}`
          );
        } else {
          const insertCategoryDescuentoQuery =
            `INSERT INTO wp_j8dwsram9m_term_relationships ( ` +
            `object_id, ` +
            `term_taxonomy_id, ` +
            `term_order ` +
            `) ` +
            `VALUES ( ` +
            `${item.ID}, 1521, 0 ` +
            `)`;
          const categoryDescuento = await sequelize.query(
            insertCategoryDescuentoQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.INSERT,
            }
          );
          if (categoryDescuento) {
            console.log(
              `Se inserto la categoria "Descuentos" en el registro con ID ${item.ID}`
            );
            itemCreateCategoryDescuento = itemCreateCategoryDescuento + 1;
          } else {
            console.log(
              `Error: No se pudo insertar la categoria "Descuentos" en el registro con ID ${item.ID}`
            );
          }
        }
        if (contador === itemsDescuento.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(
            `Se creo la categoria "Descuentos" en ${itemCreateCategoryDescuento} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
      res.json("Se esta corriendo en segundo plano");
    } else {
      res.json("No existen productos con descuento");
    }
  } catch (error) {
    console.log(error);
  }
}

//Metodo que asigna las categorias a las prendas con descuento
export async function assignCategory(req, res) {
  try {
    let contador = 1;
    let itemCreateCategoryDescuento = 0;
    let itemCreateCategoryDescuento30 = 0;
    let itemCreateCategoryDescuento50 = 0;
    const productosQuery =
      `SELECT A.ID, A.post_author, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.comment_status, A.ping_status, A.post_password, A.post_name, A.to_ping, A.pinged, A.post_modified, A.post_modified_gmt, A.post_content_filtered, A.post_parent, A.guid, A.menu_order, A.post_type, A.post_mime_type, A.comment_count, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = "_discount"`;
    const productos = await sequelize.query(productosQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    if (productos.length > 0) {
      productos.map(async (item) => {
        //Bloque que busca el status del stock de la prenda
        const statusStockQuery =
          `SELECT post_id, meta_key, meta_value ` +
          `FROM  wp_j8dwsram9m_postmeta ` +
          `WHERE  post_id = ${item.ID} AND meta_key = '_stock_status'`;
        const statusStockItem = await sequelize.query(statusStockQuery, {
          plain: false,
          raw: false,
          type: Sequelize.QueryTypes.SELECT,
        });
        //Se esta en stock hace la asignacion de categoria
        if (statusStockItem[0].meta_value === "instock") {
          switch (true) {
            //-----------------------------------------Categoria 30% de Descuento------------------------------
            case item.meta_value === "30":
              //Bloque que inserta la categoria descuento
              const searchItemCategoryDescuento_30Desc =
                `SELECT object_id, term_taxonomy_id, term_order ` +
                `FROM wp_j8dwsram9m_term_relationships ` +
                `WHERE object_id = ${item.ID} AND term_taxonomy_id = 1521`;
              const itemCategoryDescuentoExist_30Desc = await sequelize.query(
                searchItemCategoryDescuento_30Desc,
                {
                  plain: false,
                  raw: false,
                  type: Sequelize.QueryTypes.SELECT,
                }
              );
              if (itemCategoryDescuentoExist_30Desc.length > 0) {
                console.log(
                  `Ya existe la categoria "Descuentos" en el registro con ID ${item.ID}`
                );
              } else {
                const insertCategoryDescuentoQuery_30Desc =
                  `INSERT INTO wp_j8dwsram9m_term_relationships ( ` +
                  `object_id, ` +
                  `term_taxonomy_id, ` +
                  `term_order ` +
                  `) ` +
                  `VALUES ( ` +
                  `${item.ID}, 1521, 0 ` +
                  `)`;
                const categoryDescuento_30Desc = await sequelize.query(
                  insertCategoryDescuentoQuery_30Desc,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.INSERT,
                  }
                );
                if (categoryDescuento_30Desc) {
                  console.log(
                    `Se inserto la categoria "Descuentos" en el registro con ID ${item.ID}`
                  );
                  itemCreateCategoryDescuento = itemCreateCategoryDescuento + 1;
                } else {
                  console.log(
                    `Error: No se pudo insertar la categoria "Descuentos" en el registro con ID ${item.ID}`
                  );
                }
              }
              //Bloque que inserta la subcategoria 30% de Descuento
              const searchItemCategoryDescuento30_30Desc =
                `SELECT object_id, term_taxonomy_id, term_order ` +
                `FROM wp_j8dwsram9m_term_relationships ` +
                `WHERE object_id = ${item.ID} AND term_taxonomy_id = 1553`;
              const itemCategoryDescuento30Exist_30Desc = await sequelize.query(
                searchItemCategoryDescuento30_30Desc,
                {
                  plain: false,
                  raw: false,
                  type: Sequelize.QueryTypes.SELECT,
                }
              );
              if (itemCategoryDescuento30Exist_30Desc.length > 0) {
                console.log(
                  `Ya existe la categoria "30% de descuento" en el registro con ID ${item.ID}`
                );
              } else {
                const insertCategoryDescuento30Query_30Desc =
                  `INSERT INTO wp_j8dwsram9m_term_relationships ( ` +
                  `object_id, ` +
                  `term_taxonomy_id, ` +
                  `term_order ` +
                  `) ` +
                  `VALUES ( ` +
                  `${item.ID}, 1553, 0 ` +
                  `)`;
                const categoryDescuento30_30Desc = await sequelize.query(
                  insertCategoryDescuento30Query_30Desc,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.INSERT,
                  }
                );
                if (categoryDescuento30_30Desc) {
                  console.log(
                    `Se inserto la categoria "30% de Descuento" en el registro con ID ${item.ID}`
                  );
                  itemCreateCategoryDescuento30 =
                    itemCreateCategoryDescuento30 + 1;
                } else {
                  console.log(
                    `Error: No se pudo insertar la categoria "30% de Descuento" en el registro con ID ${item.ID}`
                  );
                }
              }
              break;
            //-------------------------------------FIN (Categoria 30% de Descuento)----------------------------
            //-----------------------------------------Categoria 50% de Descuento------------------------------
            case item.meta_value === "50":
              //Bloque que inserta la categoria descuento
              const searchItemCategoryDescuento_50Desc =
                `SELECT object_id, term_taxonomy_id, term_order ` +
                `FROM wp_j8dwsram9m_term_relationships ` +
                `WHERE object_id = ${item.ID} AND term_taxonomy_id = 1521`;
              const itemCategoryDescuentoExist_50Desc = await sequelize.query(
                searchItemCategoryDescuento_50Desc,
                {
                  plain: false,
                  raw: false,
                  type: Sequelize.QueryTypes.SELECT,
                }
              );
              if (itemCategoryDescuentoExist_50Desc.length > 0) {
                console.log(
                  `Ya existe la categoria "Descuentos" en el registro con ID ${item.ID}`
                );
              } else {
                const insertCategoryDescuentoQuery_50Desc =
                  `INSERT INTO wp_j8dwsram9m_term_relationships ( ` +
                  `object_id, ` +
                  `term_taxonomy_id, ` +
                  `term_order ` +
                  `) ` +
                  `VALUES ( ` +
                  `${item.ID}, 1521, 0 ` +
                  `)`;
                const categoryDescuento_50Desc = await sequelize.query(
                  insertCategoryDescuentoQuery_50Desc,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.INSERT,
                  }
                );
                if (categoryDescuento_50Desc) {
                  console.log(
                    `Se inserto la categoria "Descuentos" en el registro con ID ${item.ID}`
                  );
                  itemCreateCategoryDescuento = itemCreateCategoryDescuento + 1;
                } else {
                  console.log(
                    `Error: No se pudo insertar la categoria "Descuentos" en el registro con ID ${item.ID}`
                  );
                }
              }
              //Bloque que inserta la subcategoria 50% de Descuento
              const searchItemCategoryDescuento50_50Desc =
                `SELECT object_id, term_taxonomy_id, term_order ` +
                `FROM wp_j8dwsram9m_term_relationships ` +
                `WHERE object_id = ${item.ID} AND term_taxonomy_id = 1554`;
              const itemCategoryDescuento50Exist_50Desc = await sequelize.query(
                searchItemCategoryDescuento50_50Desc,
                {
                  plain: false,
                  raw: false,
                  type: Sequelize.QueryTypes.SELECT,
                }
              );
              if (itemCategoryDescuento50Exist_50Desc.length > 0) {
                console.log(
                  `Ya existe la categoria "50% de descuento" en el registro con ID ${item.ID}`
                );
              } else {
                const insertCategoryDescuento50Query_50Desc =
                  `INSERT INTO wp_j8dwsram9m_term_relationships ( ` +
                  `object_id, ` +
                  `term_taxonomy_id, ` +
                  `term_order ` +
                  `) ` +
                  `VALUES ( ` +
                  `${item.ID}, 1554, 0 ` +
                  `)`;
                const categoryDescuento50_50Desc = await sequelize.query(
                  insertCategoryDescuento50Query_50Desc,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.INSERT,
                  }
                );
                if (categoryDescuento50_50Desc) {
                  console.log(
                    `Se inserto la categoria "50% de Descuento" en el registro con ID ${item.ID}`
                  );
                  itemCreateCategoryDescuento50 =
                    itemCreateCategoryDescuento50 + 1;
                } else {
                  console.log(
                    `Error: No se pudo insertar la categoria "50% de Descuento" en el registro con ID ${item.ID}`
                  );
                }
              }
              break;
            //-------------------------------------FIN (Categoria 50% de Descuento)----------------------------
            //--------------------------------------------Sin Categoria----------------------------------------
            default:
              console.log(
                `El registro con ID ${item.ID} no aplica a ninguna categoria`
              );
              break;
            //--------------------------------------------FIN (Sin Categoria)----------------------------------------
          }
          if (contador === productos.length) {
            console.log("FIN DE LA EJECUCIÓN");
            console.log(
              `Se agregaron ${itemCreateCategoryDescuento} a la categoria "Descuentos"`
            );
            console.log(
              `Se agregaron ${itemCreateCategoryDescuento30} a la categoria "30% de Descuento"`
            );
            console.log(
              `Se agregaron ${itemCreateCategoryDescuento50} a la categoria "50% de Descuento"`
            );
          } else {
            contador = contador + 1;
          }
        } else {
          if (contador === productos.length) {
            console.log("FIN DE LA EJECUCIÓN");
            console.log(
              `Se agregaron ${itemCreateCategoryDescuento} a la categoria "Descuentos"`
            );
            console.log(
              `Se agregaron ${itemCreateCategoryDescuento30} a la categoria "30% de Descuento"`
            );
            console.log(
              `Se agregaron ${itemCreateCategoryDescuento50} a la categoria "50% de Descuento"`
            );
          } else {
            contador = contador + 1;
          }
        }
      });
      res.json("Se esta ejecuntando en segundo plano");
    } else {
      res.json("No existen productos");
    }
  } catch (error) {
    res.json(error.message);
  }
}

//Metodo que elimina los descuentos de los items por categoria
export async function removeDiscountByCategoria(req, res) {
  try {
    const { categoria } = req.params;
    let contador = 1;
    let setDiscount = 0;
    let setDescription = 0;
    let setPrice = 0;
    let deleteCategoriaDescuento = 0;
    let deleteCategoria30Descuento = 0;
    let deleteCategoria50Descuento = 0;
    const productosQuery =
      `SELECT A.ID, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.post_name, A.post_modified, A.post_modified_gmt, A.guid, A.post_type, B.meta_key, B.meta_value, C.term_taxonomy_id, C.term_order ` +
      `FROM wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ON A.ID = B.post_id ` +
      `INNER JOIN wp_j8dwsram9m_term_relationships C ON A.ID = C.object_id ` +
      `WHERE A.post_type = "product" ` +
      `AND A.post_status = "publish" ` +
      `AND B.meta_key = '_discount' ` +
      `AND C.term_taxonomy_id = ${categoria}`;
    const productos = await sequelize.query(productosQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    if (productos.length > 0) {
      res.json("Se esta ejecutando en segundo plano");
      productos.map(async (item) => {
        if (item.meta_value === "30" || item.meta_value === "50") {
          const newDiscountProductQuery =
            `UPDATE wp_j8dwsram9m_postmeta ` +
            `SET meta_value = '0' ` +
            `WHERE post_id = ${item.ID} AND meta_key = '_discount'`;
          const newDiscountProduct = await sequelize.query(
            newDiscountProductQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.UPDATE,
            }
          );
          if (newDiscountProduct) {
            console.log(`Se modifico el _discount del item con ID ${item.ID}`);
            setDiscount = setDiscount + 1;
          } else {
            console.log(
              `Error: No se modifico el _discount del item con ID ${item.ID}`
            );
          }
          //Bloque que busca la _original_description de cada item
          const getOriginalDescriptionQuery =
            `SELECT meta_id, post_id, meta_key, meta_value ` +
            `FROM  wp_j8dwsram9m_postmeta ` +
            `WHERE  meta_key = "_original_description" AND post_id = ${item.ID}`;
          const getOriginalDescription = await sequelize.query(
            getOriginalDescriptionQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.SELECT,
            }
          );
          const originalDescriptionItem = getOriginalDescription[0].meta_value;
          //Bloque que busca la _original_price de cada item
          const getOriginalPriceQuery =
            `SELECT meta_id, post_id, meta_key, meta_value ` +
            `FROM  wp_j8dwsram9m_postmeta ` +
            `WHERE  meta_key = "_original_price" AND post_id = ${item.ID}`;
          const getOriginalPrice = await sequelize.query(
            getOriginalPriceQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.SELECT,
            }
          );
          const originalPriceItem = getOriginalPrice[0].meta_value;
          //Actualiza la description del item
          const updateDescriptionProductoQuery =
            `UPDATE wp_j8dwsram9m_posts SET post_content = "${originalDescriptionItem}", ` +
            `post_excerpt = "${originalDescriptionItem}" ` +
            `WHERE ID = ${item.ID}`;
          const newDescriptionProduct = await sequelize.query(
            updateDescriptionProductoQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.UPDATE,
            }
          );
          if (newDescriptionProduct) {
            console.log(
              `Se modifico la descripcion del item con ID ${item.ID}`
            );
            setDescription = setDescription + 1;
          } else {
            console.log(
              `Error: No se modifico la descripcion del item con ID ${item.ID}`
            );
          }
          //Actualiza el price del item
          const updatePriceQuery =
            `UPDATE wp_j8dwsram9m_postmeta ` +
            `SET meta_value = '${originalPriceItem}' ` +
            `WHERE post_id = ${item.ID} AND meta_key = '_price'`;
          const updatePrice = await sequelize.query(updatePriceQuery, {
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.UPDATE,
          });
          if (updatePrice) {
            console.log(`Se modifico el precio del item con ID ${item.ID}`);
            setPrice = setPrice + 1;
          } else {
            console.log(
              `Error: No se modifico el precio del item con ID ${item.ID}`
            );
          }
          //Se borra la categoria Descuentos
          const deleteCategoriaDescuentosQuery =
            `DELETE FROM wp_j8dwsram9m_term_relationships ` +
            `WHERE object_id = ${item.ID} AND term_taxonomy_id = 1521`;
          const deleteCategoriaDescuentos = sequelize.query(
            deleteCategoriaDescuentosQuery,
            {
              plain: false,
              raw: false,
              type: Sequelize.QueryTypes.DELETE,
            }
          );
          if (deleteCategoriaDescuentos) {
            console.log(
              `Se elimino la categoria Descuentos del item con ID ${item.ID}`
            );
            deleteCategoriaDescuento = deleteCategoriaDescuento + 1;
          } else {
            console.log(
              `Error: No se elimino la categoria Descuentos del item con ID ${item.ID}`
            );
          }
          //Se borra la categoria del 30% 0 50% de Descuento
          if (item.meta_value === "30") {
            const deleteCategoria30DescuentosQuery =
              `DELETE FROM wp_j8dwsram9m_term_relationships ` +
              `WHERE object_id = ${item.ID} AND term_taxonomy_id = 1553`;
            const deleteCategoria30Descuentos = sequelize.query(
              deleteCategoria30DescuentosQuery,
              {
                plain: false,
                raw: false,
                type: Sequelize.QueryTypes.DELETE,
              }
            );
            if (deleteCategoria30Descuentos) {
              console.log(
                `Se elimino la categoria 30% de Descuento del item con ID ${item.ID}`
              );
              deleteCategoria30Descuento = deleteCategoria30Descuento + 1;
            } else {
              console.log(
                `Error: No se elimino la categoria 30% de Descuento del item con ID ${item.ID}`
              );
            }
          }
          if (item.meta_value === "50") {
            const deleteCategoria50DescuentosQuery =
              `DELETE FROM wp_j8dwsram9m_term_relationships ` +
              `WHERE object_id = ${item.ID} AND term_taxonomy_id = 1554`;
            const deleteCategoria50Descuentos = sequelize.query(
              deleteCategoria50DescuentosQuery,
              {
                plain: false,
                raw: false,
                type: Sequelize.QueryTypes.DELETE,
              }
            );
            if (deleteCategoria50Descuentos) {
              console.log(
                `Se elimino la categoria 50% de Descuento del item con ID ${item.ID}`
              );
              deleteCategoria50Descuento = deleteCategoria50Descuento + 1;
            } else {
              console.log(
                `Error: No se elimino la categoria 50% de Descuento del item con ID ${item.ID}`
              );
            }
          }
        }
        if (contador === productos.length) {
          console.log("FIN DE LA EJECUCIÓN");
          console.log(`Se cambio el precio a ${setPrice} registros`);
          console.log(`Se cambio la descripción a ${setDescription} registros`);
          console.log(`Se el discount a ${setDiscount} registros`);
          console.log(
            `Se elimino la categoria descuentos a ${deleteCategoriaDescuento} registros`
          );
          console.log(
            `Se elimino la categoria 30% de descuento a ${deleteCategoria30Descuento} registros`
          );
          console.log(
            `Se elimino la categoria 50% de descuento a ${deleteCategoria50Descuento} registros`
          );
        } else {
          contador = contador + 1;
        }
      });
    } else {
      res.json("No existen productos");
    }
  } catch (error) {
    res.json(error.message);
  }
}

//Metodo de Politicas de Descuento
export async function politicasDescuento(req, res) {
  try {
    let contador = 1;
    let itemsAplicadoDescuento = 0;
    let itemsChangeDiscount = 0;
    let itemsChangeDescription = 0;
    let itemsChangeStatusDiscount = 0;
    let policyBetween60x119 = 0;
    let policy120More = 0;
    let noDiscountPolicy = 0;
    const productosQuery =
      `SELECT DATEDIFF(NOW(), A.post_date) AS dias_en_inventario, A.ID, A.post_date, A.post_date_gmt, A.post_content, A.post_title, A.post_excerpt, A.post_status, A.post_name, A.post_modified, A.post_modified_gmt, A.guid, A.post_type, B.meta_key, B.meta_value ` +
      `FROM  wp_j8dwsram9m_posts A ` +
      `INNER JOIN wp_j8dwsram9m_postmeta B ` +
      `ON A.ID = B.post_id ` +
      `WHERE  A.post_type = "product" ` +
      `AND  A.post_status = "publish" ` +
      `AND B.meta_key = "_original_price"`;
    const productos = await sequelize.query(productosQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    if (productos.length > 0) {
      res.json("Se esta ejecutando en segundo plano");

      productos.map(async (item) => {
        //Bloque que busca el status discount de la prenda
        const statusDiscountQuery =
          `SELECT meta_id, post_id, meta_key, meta_value ` +
          `FROM  wp_j8dwsram9m_postmeta ` +
          `WHERE  meta_key = "_status_discount" AND post_id = ${item.ID}`;
        const statusDiscountItem = await sequelize.query(statusDiscountQuery, {
          plain: false,
          raw: false,
          type: Sequelize.QueryTypes.SELECT,
        });
        //Si el status discount es 1 entra
        if (statusDiscountItem[0].meta_value === "1") {
          //Bloque que busca el status del stock de la prenda
          const statusStockQuery =
            `SELECT post_id, meta_key, meta_value ` +
            `FROM  wp_j8dwsram9m_postmeta ` +
            `WHERE  post_id = ${item.ID} AND meta_key = '_stock_status'`;
          const statusStockItem = await sequelize.query(statusStockQuery, {
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.SELECT,
          });
          //---------------------------------
          //Si el status es "instock" se le actualizo el precio con el descuento
          if (statusStockItem[0].meta_value === "instock") {
            switch (true) {
              //-------------------------------------------------Politica de 120 dias o mas---------------------------------------------------------
              case item.dias_en_inventario >= 120:
                policy120More = policy120More + 1;
                //Bloque que busca la _original_description de cada item
                const getOriginalDescriptionQuery_120More =
                  `SELECT meta_id, post_id, meta_key, meta_value ` +
                  `FROM  wp_j8dwsram9m_postmeta ` +
                  `WHERE  meta_key = "_original_description" AND post_id = ${item.ID}`;
                const getOriginalDescription_120More = await sequelize.query(
                  getOriginalDescriptionQuery_120More,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.SELECT,
                  }
                );
                const originalDescriptionItem_120More =
                  getOriginalDescription_120More[0].meta_value;
                //Bloque que busca el _discount de cada item
                const getDiscountItemQuery_120More =
                  `SELECT meta_id, post_id, meta_key, meta_value ` +
                  `FROM  wp_j8dwsram9m_postmeta ` +
                  `WHERE  meta_key = "_discount" AND post_id = ${item.ID}`;
                const getDiscountItem_120More = await sequelize.query(
                  getDiscountItemQuery_120More,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.SELECT,
                  }
                );
                const itemDiscount_120More =
                  getDiscountItem_120More[0].meta_value;
                //Si el item tiene 30% de descuento pasa a 50%
                if (itemDiscount_120More === "30") {
                  const precioNormal = parseInt(item.meta_value, 10);
                  const descuento = precioNormal * 0.5;
                  const precioDescuento = Math.round(precioNormal - descuento);
                  const precioFinal = precioDescuento.toString();
                  // Bloque que actualiza el precio de la prenda
                  const updatePriceProductoQuery_120More =
                    `UPDATE wp_j8dwsram9m_postmeta ` +
                    `SET meta_value = '${precioFinal}' ` +
                    `WHERE post_id = ${item.ID} AND meta_key = '_price'`;
                  const newProductPrice_120More = await sequelize.query(
                    updatePriceProductoQuery_120More,
                    {
                      plain: false,
                      raw: false,
                      type: Sequelize.QueryTypes.UPDATE,
                    }
                  );
                  if (newProductPrice_120More) {
                    console.log(
                      "Se actualizo el precio del registro con ID: " + item.ID
                    );
                    itemsAplicadoDescuento = itemsAplicadoDescuento + 1;
                  } else {
                    console.log(
                      "No se actualizo el precio del registro con ID: " +
                        item.ID
                    );
                  }
                  //Bloque que actualiza el campo discount de la prenda
                  const newDiscountProductQuery_120More =
                    `UPDATE wp_j8dwsram9m_postmeta ` +
                    `SET meta_value = '50' ` +
                    `WHERE post_id = ${item.ID} AND meta_key = '_discount'`;
                  const newDiscountProduct_120More = await sequelize.query(
                    newDiscountProductQuery_120More,
                    {
                      plain: false,
                      raw: false,
                      type: Sequelize.QueryTypes.UPDATE,
                    }
                  );
                  if (newDiscountProduct_120More) {
                    console.log(
                      "Se actualizo el discount del registro con ID: " + item.ID
                    );
                    itemsChangeDiscount = itemsChangeDiscount + 1;
                  } else {
                    console.log(
                      "No se actualizo el discount del registro con ID: " +
                        item.ID
                    );
                  }
                  //Bloque que actualiza la descripcion (post_content y post_excerpt) de la prenda
                  const new_post_content_120More =
                    `<strong>50% de Descuento</strong>\n` +
                    `<strong>Precio Oferta: ${precioFinal}.00L</strong>\n` +
                    `<strong>Precio Normal: ${item.meta_value}.00L</strong>\n` +
                    `${originalDescriptionItem_120More}`;
                  const new_post_excerpt_120More =
                    `<h4>50% de Descuento <span style='color: #E25F2E;'>Precio Normal: <del>${item.meta_value}.00L</del></span></h4>\n` +
                    `${originalDescriptionItem_120More}`;
                  const updateDescriptionProductoQuery =
                    `UPDATE wp_j8dwsram9m_posts SET post_content = "${new_post_content_120More}", ` +
                    `post_excerpt = "${new_post_excerpt_120More}" ` +
                    `WHERE ID = ${item.ID}`;
                  const newDescriptionProduct_120More = await sequelize.query(
                    updateDescriptionProductoQuery,
                    {
                      plain: false,
                      raw: false,
                      type: Sequelize.QueryTypes.UPDATE,
                    }
                  );
                  if (newDescriptionProduct_120More) {
                    console.log(
                      "Se actualizo la descripcion del registro con ID: " +
                        item.ID
                    );
                    itemsChangeDescription = itemsChangeDescription + 1;
                  } else {
                    console.log(
                      "No se actualizo la descripcion del registro con ID: " +
                        item.ID
                    );
                  }
                }
                //Si el item no tiene descuento pasa a 30%
                if (itemDiscount_120More === "0") {
                  const precioNormal = parseInt(item.meta_value, 10);
                  const descuento = precioNormal * 0.3;
                  const precioDescuento = Math.round(precioNormal - descuento);
                  const precioFinal = precioDescuento.toString();
                  // Bloque que actualiza el precio de la prenda
                  const updatePriceProductoQuery_120More =
                    `UPDATE wp_j8dwsram9m_postmeta ` +
                    `SET meta_value = '${precioFinal}' ` +
                    `WHERE post_id = ${item.ID} AND meta_key = '_price'`;
                  const newProductPrice_120More = await sequelize.query(
                    updatePriceProductoQuery_120More,
                    {
                      plain: false,
                      raw: false,
                      type: Sequelize.QueryTypes.UPDATE,
                    }
                  );
                  if (newProductPrice_120More) {
                    console.log(
                      "Se actualizo el precio del registro con ID: " + item.ID
                    );
                    itemsAplicadoDescuento = itemsAplicadoDescuento + 1;
                  } else {
                    console.log(
                      "No se actualizo el precio del registro con ID: " +
                        item.ID
                    );
                  }
                  //Bloque que actualiza el campo discount de la prenda
                  const newDiscountProductQuery_120More =
                    `UPDATE wp_j8dwsram9m_postmeta ` +
                    `SET meta_value = '30' ` +
                    `WHERE post_id = ${item.ID} AND meta_key = '_discount'`;
                  const newDiscountProduct_120More = await sequelize.query(
                    newDiscountProductQuery_120More,
                    {
                      plain: false,
                      raw: false,
                      type: Sequelize.QueryTypes.UPDATE,
                    }
                  );
                  if (newDiscountProduct_120More) {
                    console.log(
                      "Se actualizo el discount del registro con ID: " + item.ID
                    );
                    itemsChangeDiscount = itemsChangeDiscount + 1;
                  } else {
                    console.log(
                      "No se actualizo el discount del registro con ID: " +
                        item.ID
                    );
                  }
                  //Bloque que actualiza la descripcion (post_content y post_excerpt) de la prenda
                  const new_post_content_120More =
                    `<strong>30% de Descuento</strong>\n` +
                    `<strong>Precio Oferta: ${precioFinal}.00L</strong>\n` +
                    `<strong>Precio Normal: ${item.meta_value}.00L</strong>\n` +
                    `${originalDescriptionItem_120More}`;
                  const new_post_excerpt_120More =
                    `<h4>30% de Descuento <span style='color: #E25F2E;'>Precio Normal: <del>${item.meta_value}.00L</del></span></h4>\n` +
                    `${originalDescriptionItem_120More}`;
                  const updateDescriptionProductoQuery_120More =
                    `UPDATE wp_j8dwsram9m_posts SET post_content = "${new_post_content_120More}", ` +
                    `post_excerpt = "${new_post_excerpt_120More}" ` +
                    `WHERE ID = ${item.ID}`;
                  const newDescriptionProduct_120More = await sequelize.query(
                    updateDescriptionProductoQuery_120More,
                    {
                      plain: false,
                      raw: false,
                      type: Sequelize.QueryTypes.UPDATE,
                    }
                  );
                  if (newDescriptionProduct_120More) {
                    console.log(
                      "Se actualizo la descripcion del registro con ID: " +
                        item.ID
                    );
                    itemsChangeDescription = itemsChangeDescription + 1;
                  } else {
                    console.log(
                      "No se actualizo la descripcion del registro con ID: " +
                        item.ID
                    );
                  }
                }
                //Actualizo el status discount a 0
                const updateStatusDiscountQuery_120More =
                  `UPDATE wp_j8dwsram9m_postmeta ` +
                  `SET meta_value = '0' ` +
                  `WHERE post_id = ${item.ID} AND meta_key = '_status_discount'`;
                const updateStatusDiscount_120More = await sequelize.query(
                  updateStatusDiscountQuery_120More,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.UPDATE,
                  }
                );
                if (updateStatusDiscount_120More) {
                  console.log(
                    "Se actualizo el status discount del registro con ID: " +
                      item.ID
                  );
                  itemsChangeStatusDiscount = itemsChangeStatusDiscount + 1;
                } else {
                  console.log(
                    "No se actualizo el status discount del registro con ID: " +
                      item.ID
                  );
                }
                break;
              //----------------------------------------------FIN (Politica de 120 dias o mas)------------------------------------------------------
              //--------------------------------------------------Politica de 60 a 119 dias---------------------------------------------------------
              case item.dias_en_inventario >= 60 &&
                item.dias_en_inventario < 120:
                policyBetween60x119 = policyBetween60x119 + 1;
                //Bloque que busca la _original_description de cada item
                const getOriginalDescriptionQuery_60Between119 =
                  `SELECT meta_id, post_id, meta_key, meta_value ` +
                  `FROM  wp_j8dwsram9m_postmeta ` +
                  `WHERE  meta_key = "_original_description" AND post_id = ${item.ID}`;
                const getOriginalDescription_60Between119 = await sequelize.query(
                  getOriginalDescriptionQuery_60Between119,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.SELECT,
                  }
                );
                const originalDescriptionItem_60Between119 =
                  getOriginalDescription_60Between119[0].meta_value;
                //---------------------------------------------------
                const precioNormal = parseInt(item.meta_value, 10);
                const descuento = precioNormal * 0.3;
                const precioDescuento = Math.round(precioNormal - descuento);
                const precioFinal = precioDescuento.toString();
                // Bloque que actualiza el precio de la prenda
                const updatePriceProductoQuery_60Between119 =
                  `UPDATE wp_j8dwsram9m_postmeta ` +
                  `SET meta_value = '${precioFinal}' ` +
                  `WHERE post_id = ${item.ID} AND meta_key = '_price'`;
                const newProductPrice_60Between119 = await sequelize.query(
                  updatePriceProductoQuery_60Between119,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.UPDATE,
                  }
                );
                if (newProductPrice_60Between119) {
                  console.log(
                    "Se actualizo el precio del registro con ID: " + item.ID
                  );
                  itemsAplicadoDescuento = itemsAplicadoDescuento + 1;
                } else {
                  console.log(
                    "No se actualizo el precio del registro con ID: " + item.ID
                  );
                }
                //Bloque que actualiza el campo discount de la prenda
                const newDiscountProductQuery_60Between119 =
                  `UPDATE wp_j8dwsram9m_postmeta ` +
                  `SET meta_value = '30' ` +
                  `WHERE post_id = ${item.ID} AND meta_key = '_discount'`;
                const newDiscountProduct_60Between119 = await sequelize.query(
                  newDiscountProductQuery_60Between119,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.UPDATE,
                  }
                );
                if (newDiscountProduct_60Between119) {
                  console.log(
                    "Se actualizo el discount del registro con ID: " + item.ID
                  );
                  itemsChangeDiscount = itemsChangeDiscount + 1;
                } else {
                  console.log(
                    "No se actualizo el discount del registro con ID: " +
                      item.ID
                  );
                }
                //Bloque que actualiza la descripcion (post_content y post_excerpt) de la prenda
                const new_post_content_60Between119 =
                  `<strong>30% de Descuento</strong>\n` +
                  `<strong>Precio Oferta: ${precioFinal}.00L</strong>\n` +
                  `<strong>Precio Normal: ${item.meta_value}.00L</strong>\n` +
                  `${originalDescriptionItem_60Between119}`;
                const new_post_excerpt_60Between119 =
                  `<h4>30% de Descuento <span style='color: #E25F2E;'>Precio Normal: <del>${item.meta_value}.00L</del></span></h4>\n` +
                  `${originalDescriptionItem_60Between119}`;
                const updateDescriptionProductoQuery_60Between119 =
                  `UPDATE wp_j8dwsram9m_posts SET post_content = "${new_post_content_60Between119}", ` +
                  `post_excerpt = "${new_post_excerpt_60Between119}" ` +
                  `WHERE ID = ${item.ID}`;
                const newDescriptionProduct_60Between119 = await sequelize.query(
                  updateDescriptionProductoQuery_60Between119,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.UPDATE,
                  }
                );
                if (newDescriptionProduct_60Between119) {
                  console.log(
                    "Se actualizo la descripcion del registro con ID: " +
                      item.ID
                  );
                  itemsChangeDescription = itemsChangeDescription + 1;
                } else {
                  console.log(
                    "No se actualizo la descripcion del registro con ID: " +
                      item.ID
                  );
                }
                //Actualizo el status discount a 0
                const updateStatusDiscountQuery_60Between119 =
                  `UPDATE wp_j8dwsram9m_postmeta ` +
                  `SET meta_value = '0' ` +
                  `WHERE post_id = ${item.ID} AND meta_key = '_status_discount'`;
                const updateStatusDiscount_60Between119 = await sequelize.query(
                  updateStatusDiscountQuery_60Between119,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.UPDATE,
                  }
                );
                if (updateStatusDiscount_60Between119) {
                  console.log(
                    "Se actualizo el status discount del registro con ID: " +
                      item.ID
                  );
                  itemsChangeStatusDiscount = itemsChangeStatusDiscount + 1;
                } else {
                  console.log(
                    "No se actualizo el status discount del registro con ID: " +
                      item.ID
                  );
                }
                break;
              //---------------------------------------------FIN (politica de 60 a 119 dias)-------------------------------------
              //--------------------------------------------------------Sin politica-----------------------------------------------
              default:
                noDiscountPolicy = noDiscountPolicy + 1;
                //Cambia el status discount a 0
                const updateStatusDiscountQuery_NoPolicy =
                  `UPDATE wp_j8dwsram9m_postmeta ` +
                  `SET meta_value = '0' ` +
                  `WHERE post_id = ${item.ID} AND meta_key = '_status_discount'`;
                const updateStatusDiscount_NoPolicy = await sequelize.query(
                  updateStatusDiscountQuery_NoPolicy,
                  {
                    plain: false,
                    raw: false,
                    type: Sequelize.QueryTypes.UPDATE,
                  }
                );
                if (updateStatusDiscount_NoPolicy) {
                  console.log(
                    "Se actualizo el status discount del registro con ID: " +
                      item.ID
                  );
                  itemsChangeStatusDiscount = itemsChangeStatusDiscount + 1;
                } else {
                  console.log(
                    "No se actualizo el status discount del registro con ID: " +
                      item.ID
                  );
                }
                break;
              //-----------------------------------------------FIN (sin politica)----------------------------------------------------------
            }
          } else {
            //Cambia el status discount a 0
            const updateStatusDiscountQuery =
              `UPDATE wp_j8dwsram9m_postmeta ` +
              `SET meta_value = '0' ` +
              `WHERE post_id = ${item.ID} AND meta_key = '_status_discount'`;
            const updateStatusDiscount = await sequelize.query(
              updateStatusDiscountQuery,
              {
                plain: false,
                raw: false,
                type: Sequelize.QueryTypes.UPDATE,
              }
            );
            if (updateStatusDiscount) {
              console.log(
                "Se actualizo el status discount del registro con ID: " +
                  item.ID
              );
              itemsChangeStatusDiscount = itemsChangeStatusDiscount + 1;
            } else {
              console.log(
                "No se actualizo el status discount del registro con ID: " +
                  item.ID
              );
            }
          }
          if (contador === productos.length) {
            console.log("FIN DE LA EJECUCIÓN");
            console.log(
              `Se cambio el precio a ${itemsAplicadoDescuento} registros`
            );
            console.log(
              `Se cambio el discount a ${itemsChangeDiscount} registros`
            );
            console.log(
              `Se cambio la descripción a ${itemsChangeDescription} registros`
            );
            console.log(
              `Se cambio el status discount a ${itemsChangeStatusDiscount} registros`
            );
            console.log(
              `Politicas: 120 dias o mas (${policy120More}), 60 y 119 dias (${policyBetween60x119}), sin politica (${noDiscountPolicy}) `
            );
          } else {
            contador = contador + 1;
          }
        } else {
          if (contador === productos.length) {
            console.log("FIN DE LA EJECUCIÓN");
            console.log(
              `Se cambio el precio a ${itemsAplicadoDescuento} registros`
            );
            console.log(
              `Se cambio el discount a ${itemsChangeDiscount} registros`
            );
            console.log(
              `Se cambio la descripción a ${itemsChangeDescription} registros`
            );
            console.log(
              `Se cambio el status discount a ${itemsChangeStatusDiscount} registros`
            );
            console.log(
              `Politicas: 120 dias o mas (${policy120More}), 60 y 119 dias (${policyBetween60x119}), sin politica (${noDiscountPolicy}) `
            );
          } else {
            contador = contador + 1;
          }
        }
      });
    } else {
      res.json("No existen productos");
    }
  } catch (error) {
    res.json(error.message);
  }
}
