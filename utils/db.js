// import mysql from 'mysql2/promise';

// const dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_PREFIX,
// };

// let connection: mysql.Connection;

// async function getDbConnection() {
//     if (!connection) {
//         connection = await mysql.createConnection(dbConfig);
//     }
//     return connection;
// }

// async function checkConnection() {
//     try {
//         const conn = await getDbConnection();
//         await conn.ping();
//         console.log("Database succesful");
        
//         return true;
//     } catch (error) {
//         console.error('Database connection error:', error);
//         return false;
//     }
// }

// export { getDbConnection, checkConnection };