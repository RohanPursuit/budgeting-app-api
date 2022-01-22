import express from "express"
import transactions from "../models/transactions.js"
import sampleObject from "../models/sampleObject.js"
import validKey, {sortBy, filterBy} from "../helper/helperFunctions.js"
import dotenv from "dotenv"

dotenv.config()

// const PASSWORD = process.env.PASSWORD  || null
let userName = null
let password = null

const budget = express.Router()

budget.get("/admin", (request, response) => {
    console.log("Get /admin")
    response.send(transactions)
})

budget.get("/user/signin", (request, response) => {
    console.log("Get /user/signin")
    userName = request.body.userName
    password = request.body.password
    if(!transactions[userName]){
        response.send("Username does not exist, you need to sign up")
        return null
    } else if(transactions[userName].password !== password){
        response.send("Wrong Password")
        return null
    }
    response.send(`Signed In as ${userName}`)
})

budget.post("/user/signup", (request, response) => {
    console.log("Get /user/signup")
    const user = request.body.userName
    const pass = request.body.password
    if(transactions[user]){
        response.send("User already exist")
        return null
    }

    transactions[user] = {
        userName: user,
        password: pass,
        items: []
    }
    response.send("Signup complete")
})

budget.get("/", (request, response) => {
    console.log("Get /budget")
    if(!transactions[userName]){
        response.send("You need to sign in")
        return null
    }
    const {order, key, filterK, filterV} = request.query
    let arr = [...transactions[userName].items]
    if(!!order){
        arr = sortBy(arr, order, key)
    }
    if(!!filterK){
        arr = filterBy(arr, filterK, filterV)
    }
    response.json(arr)
})

budget.get("/:index", (request, response) => {
    console.log("Get /budget/:index")

    if(!transactions[userName]){
        response.send("You need to sign in")
        return null
    }
    const {index} = request.params
    response.json(transactions[userName].items[index])
})

budget.post("/", (request, response) => {
    console.log("Post /budget")

    if(!transactions[userName]){
        response.send("You need to sign in")
        return null
    }

    const {isValid, key} = validKey(request.body)

    if(!isValid){
        response.status(406)
        .json({
            error: "Not Acceptable",
            info: `${key[0].toUpperCase() + key.slice(1)} should be a ${sampleObject[key]} data type`,
            example: sampleObject,
        })
    } else {
        //try using linked list @Jose
        transactions[userName].items.unshift(request.body)
        response.json(transactions[userName].items)
    }  
})

budget.put("/:index", (request, response) => {
    console.log("Put /budget/:index")

    if(!transactions[userName]){
        response.send("You need to sign in")
        return null
    }

    const {index} = request.params
    const {isValid, key} = validKey(request.body)
    if(!!transactions[userName].items[index]){
        transactions[userName].items[index] = request.body
        response.json(transactions[userName].items)
    } else if(!isValid){
        response.status(406)
        .json({
            error: "Not Acceptable",
            info: `${key[0].toUpperCase() + key.slice(1)} should be a ${sampleObject[key]} data type`,
            example: sampleObject,
        })

    } else {
        response.status(404).json({
            error: "Not Found",
            info: `Item ${index} does not exist`
        })
    }

})

budget.delete("/:index", (request, response) => {
    console.log("Delete /:index")

    if(!transactions[userName]){
        response.send("You need to sign in")
        return null
    }

    const {index} = request.params
    // if(!password){
    //     response.status(401).json({
    //         error: "Unauthrized",
    //         info: "No Password entered"
    //     })

    //     return null
    // } else if(password !== PASSWORD){
    //     response.status(401).json({
    //         error: "Unauthrized",
    //         info: "Wrong Password"
    //     })

    //     return null
    // }
    const deleted = transactions[userName].items.splice(index, 1)
    response.json(deleted)
})

export default budget