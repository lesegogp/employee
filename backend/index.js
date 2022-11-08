import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"

import employeeDAO from './dao/employeeDAO.js'


async function main() {
    dotenv.config()

    const client = new mongodb.MongoClient(
        process.env.EMPLOYEE_DB_URI
    )
    const port = process.env.PORT || 8000
    try {
        // Connect to the MongoDB cluster
        await client.connect()
        await employeeDAO.injectDB(client)
    
        
        app.listen(port, () => {
            console.log('server is running on port:' + port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
}

main().catch(console.error);