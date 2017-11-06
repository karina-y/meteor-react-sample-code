/*
created by: karina
created date: 10/3/17
*/


const NullChecks = {};


//check for null or undefined or empty string or empty array or empty object, basically if the item has no useful content
/*
ie: item = null                                     /////returns true
    item = ""                                       /////returns true
    item = []                                       /////returns true
    item = {}                                       /////returns true
    item = { "key" : "" }                           /////returns true
    item = { "key" : [] }                           /////returns true
    item = ["content"]                              /////returns false
    item = "content"                                /////returns false
    item = { "key" : "value" }                      /////returns false
    item = { "key" : {"valuekey": "content"}};      /////returns false
    item = { "key" : ["key"] }                      /////returns false
 */
const isNullOrEmpty = function(item) {

    if (item == null || item == "") {
        return true;
    }
    //check if it's not an empty string
    else if (!Array.isArray(item) && item.length > 0) {
        return false;
    }
    else {
        const emptyArray = this.isNullOrEmptyArray(item);
        const isNullOrEmptyObject = this.isNullOrEmptyObjectAndKeys(item);

        if (emptyArray && isNullOrEmptyObject) {
            return true;
        }

        else {
            return false;
        }
    }
};


//check if item is null, and if it's an array, and if it's length is > 0
/*
ie: arr = ["content"]       /////returns true
	arr = null              /////returns false
    arr = []                /////returns false
 */
const isNullOrEmptyArray = function(arr) {

    if (arr && Array.isArray(arr) && arr.length > 0) {
        for (let i = 0; i < arr.length; i ++) {
            if (arr[i] != null) {
                return false
                break;
            }
        }

        return true;
    }
    else {
        return true;
    }
};



//checks for empty object (will return false if there are keys regardless of whether or not their values are null)
/*
ie: obj = {}                /////returns true
    obj = { "key" : "" }    /////returns false
    obj = { "key" : [] }    /////returns false
 */
const isNullOrEmptyObject = function(obj) {

    //if null
    if (obj == null) {
        return true;
    }
    //if not an object
    else if (typeof(obj) != "object") {
        return true;
    }
    //if no keys
    else if (Object.keys(obj).length === 0) {
        return true;
    }
    else {
        return false;
    }

};


//checks for empty object (will return true if there are keys with null/empty values)
/*
ie: obj = {}                	  /////returns true
    obj = { "key" : "" }    	  /////returns true
    obj = { "key" : [] }    	  /////returns true
	obj = { "key" : "value" }     /////returns false
    obj = { "key" : ["value] }    /////returns false
 */
const isNullOrEmptyObjectAndKeys = function(obj) {
    //if empty
    if (this.isNullOrEmptyObject(obj)) {
        return true;
    }
    else {
        //check for empty values (null, undefined, empty obj, empty array
        for (const key in obj) {
            if (obj[key] !== null && obj[key] != "") {
                //not null or empty string
                //continue to check if it's an empty obj or array

                if (obj[key] == null || obj[key] == "") {
                    return true;
                    break;
                }
                else if (Array.isArray(obj[key]) && this.isNullOrEmptyArray(obj[key])) {
                    return true;
                    break;
                }
                else if (typeof(obj[key]) == "object" && this.isNullOrEmptyObject(obj[key])) {
                    return true;
                    break;
                }
                else {
                    return false;
                    break;
                }
            }
            else {
                return true;
                break;
            }


        }
    }

    //passed above cases, return false
    return false;
};

NullChecks.isNullOrEmpty = isNullOrEmpty;
NullChecks.isNullOrEmptyArray = isNullOrEmptyArray;
NullChecks.isNullOrEmptyObject = isNullOrEmptyObject;
NullChecks.isNullOrEmptyObjectAndKeys = isNullOrEmptyObjectAndKeys;


export default NullChecks;