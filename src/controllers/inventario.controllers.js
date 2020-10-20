import { sequelize } from "../database/database";
import { dbSQLServer } from "../database/dbSQLServer";
import Sequelize from "sequelize";

export async function getSku(req, res) {
  try {
    const { referencia } = req.params;
    const searchReferenciaXQuery =
      `SELECT Referencia ` +
      `,ReferenciaX ` +
      `FROM TBLDocumentoEtiquetaUbicacionesOnline ` +
      `WHERE Referencia = '${referencia}'`;
    const referenciaX = await dbSQLServer.query(searchReferenciaXQuery, {
      plain: false,
      raw: false,
      type: Sequelize.QueryTypes.SELECT,
    });
    if (referenciaX.length > 0) {
      res.json({
        sku: referenciaX[0].ReferenciaX,
      });
    } else {
      const searchPostIdQuery =
        `SELECT post_id ` +
        `FROM wp_j8dwsram9m_postmeta ` +
        `WHERE meta_key = "_sku" ` +
        `AND meta_value = "${referencia}"`;
      const postId = await sequelize.query(searchPostIdQuery, {
        plain: false,
        raw: false,
        type: Sequelize.QueryTypes.SELECT,
      });
      postId.length > 0
        ? res.json({
            sku: referencia,
          })
        : res.json(false);
    }
  } catch (error) {
    res.json(error.message);
  }
}

export async function sp_reduce_stock(req, res) {
  const { sku, quantity } = req.body;
  const sp_reduce_stock = `call sp_reduce_stock('${sku}', ${quantity})`;
  await sequelize
    .query(sp_reduce_stock, {
      type: Sequelize.QueryTypes.RAW,
    })
    .then(() => {
      res.json(true);
    })
    .catch(() => {
      res.json(false);
    });
}
