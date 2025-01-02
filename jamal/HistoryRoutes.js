const express = require("express")
const database = require("./connect")
const { ObjectId } = require("mongodb")
const objectId = require("mongodb").ObjectId
let historyRoutes = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config({ path: "./config.env" })

// ambil semua 
//http:localhot:3000/ActiveHotel
historyRoutes.route("/ActiveHotel").get(/*VerifyToken,*/ async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("ActiveHotel").find({}).toArray()
    if (data.length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

// ambul satu
//http:localhost:3000/ActiveHotel/12345
historyRoutes.route("/ActiveHotel/:id").get(/*VerifyToken,*/ async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("ActiveHotel").findOne({ _id: new ObjectId(request.params.id) })
    if (Object.keys(data).length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

//post
//http:localhost:3000/ActiveHotel
historyRoutes.route("/ActiveHotel").post(/*VerifyToken,*/ async (request, response) => {
    let db = database.getDb()
    let mongoObject = {
        userId: request.body.userId,
        roomId: request.body.roomId,
        checkin: request.body.checkin,
        checkout: request.body.checkout
    }
    let data = await db.collection("ActiveHotel").insertOne(mongoObject)
    response.json(data)
})

//update
//http:localhost:3000/ActiveHotel
historyRoutes.route("/ActiveHotel/:id").put(/*VerifyToken,*/ async (request, response) => {
    let db = database.getDb()
    let mongoObject = {
        $set: {
            userId: request.body.userId,
            roomId: request.body.IdKamar,
            checkin: request.body.checkin,
            checkout: request.body.checkout
        }
    }
    let data = await db.collection("ActiveHotel").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject)
    response.json(data)
})

//hapus
historyRoutes.route("/ActiveHotel/:id").get(async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("ActiveHotel").deleteOne({ _id: new ObjectId(request.params.id) })
    response.json(data)
})


// function VerifyToken(request, response, next) {
//     const authHeaders = request.headers["Authorization"]
//     const token = authHeaders && authHeaders.split(' ')[1]
//     if (!token) {
//         return response.status(401).json({message : "Auth token is missing"})

//     }

//     jwt.verify(token, process.env.SECRETKEY, (error, user) => {
//         if (error) {
//             return response.status(403).json({message: "Invalid Token"})
//         }

//         request.body.user = user
//         next()
//     })
// }

module.exports = historyRoutes