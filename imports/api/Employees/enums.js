const EmployeeEnums = {};

const EMPLOYEE_SIGNUP_ENUM = {
    'none': {'enum': 0, 'displayName': 'none'},
    'registeredByCompany': {'enum': 1, 'displayName': 'Registered By Company'},
    'confirmedByEmployee': {'enum': 2, 'displayName': 'Confirmed By Employee'}
};

EmployeeEnums.EMPLOYEE_SIGNUP_ENUM = EMPLOYEE_SIGNUP_ENUM;
export default EmployeeEnums;
