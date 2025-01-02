const connect = require("./connect")
const express = require("express")
const cors = require("cors")
const KamarHotel = require("./postRoutes")
const Users = require("./userRoutes")
const historyRoutes = require("./HistoryRoutes")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(KamarHotel)
app.use(Users)
app.use(historyRoutes)

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log(`Alhamdulillah udh konek ke ${PORT}`)
})