const express = require("express")
const database = require("./connect")
const { ObjectId } = require("mongodb")
const objectId = require("mongodb").ObjectId
let postRoutes = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config({ path: "./config.env" })

// ambil semua 
//http:localhot:3000/KamarHotel
postRoutes.route("/KamarHotel").get(/*VerifyToken,*/ async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("KamarHotel").find({}).toArray()
    if (data.length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

// ambul satu
//http:localhost:3000/KamarHotel/12345
postRoutes.route("/KamarHotel/:id").get(/*VerifyToken,*/ async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("KamarHotel").findOne({ _id: new ObjectId(request.params.id) })
    if (Object.keys(data).length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

//post
//http:localhost:3000/KamarHotel
postRoutes.route("/KamarHotel").post(/*VerifyToken,*/ async (request, response) => {
    let db = database.getDb()
    let mongoObject = {
        NomorKamar: request.body.NomorKamar,
        Occupier: request.body.Occupier,
        Breakfast: request.body.Breakfast,
        JenisKamar: request.body.JenisKamar,
        Checkin: request.body.Checkin,
        Checkout: request.body.Checkout
    }
    let data = await db.collection("KamarHotel").insertOne(mongoObject)
    response.json(data)
})

//update
//http:localhost:3000/KamarHotel
postRoutes.route("/KamarHotel/:id").put(/*VerifyToken,*/ async (request, response) => {
    let db = database.getDb()
    let mongoObject = {
        $set: {
            NomorKamar: request.body.NomorKamar,
            Occupier: request.body.Occupier,
            Breakfast: request.body.Breakfast,
            JenisKamar: request.body.JenisKamar,
            Checkin: request.body.Checkin,
            Checkout: request.body.Checkout
        }
    }
    let data = await db.collection("KamarHotel").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject)
    response.json(data)
})

//hapus
postRoutes.route("/KamarHotel/:id").get(async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("KamarHotel").deleteOne({ _id: new ObjectId(request.params.id) })
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

module.exports = postRoutes