import express from "express"
import transactions from "../models/transactions.js"
import sampleObject from "../models/sampleObject.js"
import validKey, {sortBy, filterBy} from "../helper/helperFunctions.js"


const budget = express.Router()

const keys = {}


budget.get("/admin", (request, response) => {
    console.log("Get /admin")
    response.send(transactions)
})

budget.get("/user/signin", (request, response) => {
    console.log("Get /user/signin")
    const {userName, password} = request.query

    if(!transactions[userName]){
        response.json({
            error: "Name does not exist",
            info: "Username does not exist, you need to sign up",
        })
        return null
    } else if(transactions[userName].password !== password){
        response.json({
            error: "Wrong Password",
            info: "Wrong Password"
        })
        return null
    }
    //if credentials are valid, should generate a key and store it in an object with userName as value
    /**
    * Example: const keys = {
    *  "rvonwervisdbv": "john"
    * }
    */
    const format = "xxxxxxxxxxxxxxxxxxxxxx".split("").map(el => {
        return String(Math.floor(Math.random() * 10))
    }).join("")

    keys[format] = userName
    response.json(format)
})

budget.post("/user/signup", (request, response) => {
    console.log("Get /user/signup")
    const {userName, password} = request.body
    if(transactions[userName]){
        response.send("User already exist")
        return null
    }

    transactions[userName] = {
        userName,
        password,
        items: []
    }
    response.send("Signup complete")
})

budget.get("/", (request, response) => {
    console.log("Get /budget")
    const {userKey} = request.query
    if(!keys[userKey]){
        response.json({
            error: "Not Found",
            info: "You need to sign in"
        })
        return null
    }
    const {order, key, filterK, filterV} = request.query
    if(!!order){
        let arr = transactions[keys[userKey]].items
        arr = sortBy(arr, order, key)  
    }
    let arr = [...transactions[keys[userKey]].items]
    //use check boxes to filter in the frontend
    if(filterK !== "no filter" && !!filterK){
        arr = filterBy(arr, filterK, filterV)
    }
    response.json(arr)
})

budget.get("/:index", (request, response) => {
    console.log("Get /budget/:index")
    const {userKey} = request.query
    const {index} = request.params
    if(!keys[userKey]){
        response.send("You need to sign in")
        return null
    }
    response.json(transactions[keys[userKey]].items[index])
})

budget.post("/", (request, response) => {
    console.log("Post /budget")
    const {userKey, transaction} = request.body

    if(!keys[userKey]){
        response.send("You need to sign in")
        return null
    }

    const {isValid, key} = validKey(transaction)

    if(!isValid){
        response.status(406)
        .json({
            error: "Not Acceptable",
            info: `${key[0].toUpperCase() + key.slice(1)} should be a ${sampleObject[key]} data type`,
            example: sampleObject,
        })
    } else {
        //try using linked list @Jose
        transactions[keys[userKey]].items.unshift(transaction)
        response.json(transactions[keys[userKey]].items)
    }  
})

budget.put("/:index", (request, response) => {
    console.log("Put /budget/:index")

    const {userKey, transaction} = request.body
    if(!keys[userKey]){
        response.send("You need to sign in")
        return null
    }

    const {index} = request.params
    const {isValid, key} = validKey(transaction)
    // if(!!transactions[userName].items[index]){
    //     transactions[userName].items[index] = request.body[1]
    //     response.json(transactions[userName].items)
    // } else 
    if(!isValid){
        response.status(406)
        .json({
            error: "Not Acceptable",
            info: `${key[0].toUpperCase() + key.slice(1)} should be a ${sampleObject[key]} data type`,
            example: sampleObject,
        })
        return null
        
    } else if (!transactions[keys[userKey]].items[index]) {
        console.log("not valid")
        response.status(404).json({
            error: "Not Found",
            info: `Item ${index} does not exist`
        })
        return null
    }

    transactions[keys[userKey]].items[index] = transaction
    response.json(transactions[keys[userKey]].items)

})

budget.delete("/:index", (request, response) => {
    console.log("Delete /:index")

    const {userKey} = request.query
    if(!keys[userKey]){
        response.send("You need to sign in")
        return null
    }

    const {index} = request.params
    const deleted = transactions[keys[userKey]].items.splice(index, 1)
    response.json(transactions[keys[userKey]].items)
})

export default budget