/*
created by: karina
created date: 8/23/17
*/

const SharedEnums = { };

const EDUCATION_LEVEL_ENUM = {
    'none': {'enum': 0, 'displayName': 'None'},
    'associateDegree': {'enum': 1, 'displayName': "Associate's Degree"},
    'bachelorsDegree': {'enum': 2, 'displayName': "Bachelor's Degree"},
    'mastersDegree': {'enum': 3, 'displayName': "Master's Degree"},
    'doctoralDegree': {'enum': 4, 'displayName': 'Doctoral Degree'},
    'certificate': {'enum': 5, 'displayName': 'Certificate'},
    'currentlyEnrolled': {'enum': 6, 'displayName' : 'Currently Enrolled'}
};

const EXPERIENCE_LEVEL_ENUM = {
    'none': {'enum': 0, 'displayName': 'None'},
    'novice': {'enum': 1, 'displayName': '0 - 2 years - Novice'},
    'mid': {'enum': 2, 'displayName': '3 - 5 years - Junior to Mid-level'},
    'senior': {'enum': 3, 'displayName': '5+ years - Senior'}
};

const WORK_AUTH_ENUM = {
    'usCitizen': {'enum': 0, 'displayName': 'U.S. Citizen'},
    'usGreenCard': {'enum': 1, 'displayName': 'U.S. Green Card Holder'},
    'visa': {'enum': 2, 'displayName': 'Valid H1-B Visa'},
    'sponsorship': {'enum': 3, 'displayName': 'Require Company Sponsorship'}
};

SharedEnums.EDUCATION_LEVEL_ENUM = EDUCATION_LEVEL_ENUM;
SharedEnums.EXPERIENCE_LEVEL_ENUM = EXPERIENCE_LEVEL_ENUM;
SharedEnums.WORK_AUTH_ENUM = WORK_AUTH_ENUM;


export default SharedEnums;
