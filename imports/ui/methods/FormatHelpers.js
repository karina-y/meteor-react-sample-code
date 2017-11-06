/*
created by: karina
created date: 10/5/17
*/

import numeral from 'numeral';


const FormatHelpers = {};

//formats currency with dollar sign and commas
const formatCurrency = function(amount){
    return "$" + numeral(amount).format(0,0);
};

const formatMinMaxSalaryRange = function(minSalary, maxSalary) {

    let formattedSalary;

    minSalary = "$" + numeral(minSalary).format(0,0);
    maxSalary = "$" + numeral(maxSalary).format(0,0);

    formattedSalary = minSalary + " - " + maxSalary;

    return formattedSalary;
};

//convert full state name to abbreviation and vice versa
/*
ie: stateNameConverter('california', 'abbr')    /////returns "CA"
    stateNameConverter('ca', 'abbr')            /////returns "California"
 */
const stateNameConverter = function(input, to){

    const states = [
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to === 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] === input){
                return(states[i][1]);
            }
        }
    } else if (to === 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] === input){
                return(states[i][0]);
            }
        }
    }
};

FormatHelpers.formatCurrency = formatCurrency;
FormatHelpers.formatMinMaxSalaryRange = formatMinMaxSalaryRange;
FormatHelpers.stateNameConverter = stateNameConverter;


export default FormatHelpers;
