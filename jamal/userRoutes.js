const express = require("express")
const database = require("./connect")
const { ObjectId, Db } = require("mongodb")
const objectId = require("mongodb").ObjectId
let userRoutes = express.Router()
const bcrypt = require("bcrypt")
const SALT_ROUNDS = 6
const jwt = require("jsonwebtoken")
require("dotenv").config({path : "./config.env"})

// ambil semua 
//http:localhot:3000/Users
userRoutes.route("/Users").get(async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("Users").find({}).toArray()
    if (data.length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

// ambul satu
//http:localhost:3000/Users/12345
userRoutes.route("/Users/:id").get(async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("Users").findOne({ _id: new ObjectId(request.params.id) })
    if (Object.keys(data).length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

//post
//http:localhost:3000/Users
userRoutes.route("/Users").post(async (request, response) => {
    let db = database.getDb()

    const takenEmail = await db.collection("Users").findOne({ email: request.body.email })
    if (takenEmail) {
        response.json({ message: "The email is taken" })
    } else {
        const hash = await bcrypt.hash(request.body.Password, SALT_ROUNDS)

        let mongoObject = {
            Username: request.body.Username,
            email: request.body.email,
            Password: hash,
        }
        let data = await db.collection("Users").insertOne(mongoObject)
        response.json(data)
    }

})

//update
//http:localhost:3000/Users
userRoutes.route("/Users/:id").put(async (request, response) => {
    let db = database.getDb()
    let mongoObject = {
        $set: {
            Username: request.body.Username,
            email: request.body.email,
            Password: request.body.Password,
        }
    }
    let data = await db.collection("Users").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject)
    response.json(data)
})

//hapus
userRoutes.route("/Users/:id").get(async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("Users").deleteOne({ _id: new ObjectId(request.params.id) })
    response.json(data)
})

userRoutes.route("/Users/login").post(async (request, response) => {
    let db = database.getDb()

    const Luser = await db.collection("Users").findOne({ email: request.body.email })
    if (Luser) {
        let confirmation = await bcrypt.compare(request.body.Password, Luser.Password)
        if (confirmation) {
            const token = jwt.sign(Luser, process.env.SECRETKEY, {expiresIn: "1h"})
            response.json({success: true,token})
        }else(
            response.json({success: false, message: "Incorrect Password"})
        )
    }else{
        response.json({success: false, message: "User not found"})
    }

})

module.exports = userRoutes