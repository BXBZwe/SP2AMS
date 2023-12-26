import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testDatabaseConnection = async () => {
    try {
        // Connect to the database
        await prisma.$connect();
 
        // Log a success message if the query was successful
        console.log('Connected to the database successfully.');
 
        // No need to release the client in PrismaClient
    } catch (error) {
        // Log an error message if something goes wrong
        console.error('Could not connect to the database!', error);
    } finally {
        // Disconnect from the database
        await prisma.$disconnect();
    }
};
 
// Call the function to test the connection
testDatabaseConnection();
