export function getEmployeeDefaultValues() {
    const employeeDefaultValues = {
        companyId: "",  //after company is created, send its id in with employeeobj to get created
        address: {
            timezoneId: ""
        },
        photos: {
            coverPhoto: "",
            profilePhotos: [],
            mainProfilePhoto: ""
        },
        details: {
            jobTitle: "",
            phoneNumber: "",
            phoneNumberExt: "",
            phoneNumberType: [],
            hostgigHoursCompleted: 0,
            hostgigHoursUpcoming: 0,
        }
    };
    return employeeDefaultValues;
}
