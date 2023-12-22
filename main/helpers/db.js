const pg = require('pg');
const { Pool } = pg;
const pool = new Pool({
    user: 'sp2ams',
    host: 'localhost',
    database: 'sp2ams',
    password: 'sp2ams',
    port: 5432,
});
 
const testDatabaseConnection = async () => {
    try {
        // Connect to the database
        const client = await pool.connect();
 
        // Log a success message if the query was successful
        console.log('Connected to the database successfully.');
 
        // Release the client back to the pool
        client.release();
    } catch (error) {
        // Log an error message if something goes wrong
        console.error('Could not connect to the database!', error);
    }
};
 
// Call the function to test the connection
testDatabaseConnection();
 
//export default pool;