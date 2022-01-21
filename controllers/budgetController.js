import express from "express"
import transactions from "../models/transactions.js"
import sampleObject from "../models/sampleObject.js"
import validKey, {sortBy, filterBy} from "../helper/helperFunctions.js"

const budget = express.Router()

budget.get("/", (request, response) => {
    console.log("Get /budget")
    const {order, key, filterK, filterV} = request.query
    let arr = [...transactions]
    if(!!order){
        arr = sortBy(arr, order, key)
    }
    if(!!filterK){
        arr = filterBy(arr, filterK, filterV)
    }
    response.json(arr)
})

budget.get("/:index", (request, response) => {
    console.log(" get /transactions/:index")
    const {index} = request.params
    response.json(transactions[index])
})

budget.post("/", (request, response) => {
    console.log("Post /budget")

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
        transactions.unshift(request.body)
        response.json(transactions)
    }  
})

budget.put("/:index", (request, response) => {
    console.log("Put /budget/:index")
    const {index} = request.params
    const {isValid, key} = validKey(request.body)
    if(!!transactions[index]){
        transactions[index] = request.body
        response.json(transactions)
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
    const {index} = request.params
    transactions.splice(index, 1)
    response.json(transactions)
})

export default budget