// index.js
// 14th may 2025
// lohikrme

const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const { 
    getAllParrots, 
    getParrotById, 
    addNewParrot, 
    updateParrot, 
    deleteParrot } = require('./db/parrots')

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(helmet())

// crud endpoints
app.post("/api/parrots", addNewParrot)
app.get("/", (req, res) => {
    res.send("Kraak Kraak!")
})
app.get("/api/parrots", getAllParrots)
app.get("/api/parrots/:id", getParrotById)
app.put("/api/parrots/:id", updateParrot)
app.delete("/api/parrots/:id", deleteParrot)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

