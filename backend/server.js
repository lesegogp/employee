import express from 'express' //framework for node.js for easy an
import cors from 'cors' // cross origin resourse sharing  for browser to make right connections the network
import employee from  './api/employee.route.js'

const app = express()

app.use(cors())
app.use(express.json()) //use express.json enable the server to read and accept JSON in a request

app.use("/api/v1/employee", employee)
app.use('*', (req, res) => {
    res.status(404).json({ error: "not found" })
})

export default app
