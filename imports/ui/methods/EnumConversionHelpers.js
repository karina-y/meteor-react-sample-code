const EnumConversionHelpers = {};

//receives enum and returns the appropriate display name
const enumToDisplayName = function(enumsObj, enumKey) {
    let returnObj = {error: null, value: null};
    if (isNaN(enumKey)) {
        returnObj.error = "expected integer, received string";
    }
    else {
        const matchingKey = Object.keys(enumsObj).find(key => enumsObj[key].enum == enumKey);
        if( matchingKey ){
            returnObj.value = enumsObj[matchingKey].displayName;
        }else{
            returnObj.error = "no matching key";
        }
    }

    return returnObj;
};

//receives display name and returns the appropriate enum
const displayNameToEnum = function(enumsObj, displayName) {

    let returnObj = {error: null, value: null};

    if (isNaN(displayName)) {
        const matchingKey = Object.keys(enumsObj).find(key => enumsObj[key].displayName === displayName);

        returnObj.value = enumsObj[matchingKey].enum;
    }
    else {
        returnObj.error = "expected string, received integer";
    }

    return returnObj;
};

EnumConversionHelpers.enumToDisplayName = enumToDisplayName;
EnumConversionHelpers.displayNameToEnum = displayNameToEnum;


export default EnumConversionHelpers;
