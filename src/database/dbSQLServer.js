import Sequelize from 'sequelize';

export const dbSQLServer = new Sequelize(
    process.env.DB_NAME_SQL, //Nombre de la base de datos
    process.env.DB_USER_SQL, //Usuario
    process.env.DB_PASSWORD_SQL, //Password
    {
        host: process.env.DB_HOST_SQL, //Ubicacion de la base de datos
        dialect: 'mssql', //Dialecto en este caso mssql (SQL Server). Otros dialectos mysql (MySQL), mariadb (MariaDB), postgres (PostgreSQL)
        dialectOptions: { options: { encrypt: false } },
        pool: { //Pool options
            max:5,
            min:0,
            require: 30000,
            idle: 10000,
        },
        logging: false //Opcion para que no muestre mensajes por consola al momento de realizar la conexion
    }
)