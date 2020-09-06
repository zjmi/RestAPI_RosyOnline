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
