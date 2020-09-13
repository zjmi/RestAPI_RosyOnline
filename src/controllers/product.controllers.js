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
