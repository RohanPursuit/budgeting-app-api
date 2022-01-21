import sampleObject from "../models/sampleObject.js"

function validKey (obj){
    for(const [key, values] of Object.entries(obj)){
        if(typeof values !== sampleObject[key]){
            return {
                isValid: false,
                key: key,
            }
        }
    }
    return {
        isValid: true,
        key: null,
    }
}

export function sortBy(arr, order, key = "source"){
    
    return arr.sort((a, b)=> {
        if(sampleObject[key] === 'string'){
            a = a[key].toLowerCase()
            b = b[key].toLowerCase()
        } else {
            a = a[key]
            b = b[key]
        }
        
        switch(order === "asc"){
            case a < b:
                return -1;
            case a > b:
                return 1;
            case a === b:
                return 0;
        }
        switch(order === "desc"){
            case a < b:
                return 1;
            case a > b:
                return -1;
            case a === b:
                return 0;
        }
    })
}

export function filterBy(arr, key , value){
    if(key === "amount"){
        return arr.filter(el => el[key] >= Number(value.split("r")[0]) && el[key] <= Number(value.split("r")[1]))
    }
    return arr.filter(el => el[key] === value)
}

export default validKey