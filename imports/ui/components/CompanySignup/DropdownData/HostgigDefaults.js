/*
created by: karina
created date: 9/14/17
*/

export function getHostgigDefaultValues() {
    const hostgigDefaultValues = {
        additionalDetails: "",
        availability: [],
        careerId: "",
        careerCategoryId: "",
        companyId: "",
        dressCode: "",
        experienceLevel: [],
        experienceLevelPreferred: false,
        educationLevel: [],
        educationLevelPreferred: false,
        gigDetails: "",
        imageUrl: "",
        isActive: true,
        isDeleted: false,
        jobTitle: "",
        minSalary: "",
        maxSalary: "",
        mustHaves: [],
        niceToHaves: [],
        preReq: [],
        prioritizeMinorities: false,
        responsibilities: [],
        restrictAccessByUser: [],
        restrictAccessByScore: true,
        skillsNeeded: [],
        skillScoreLow: 0,
        skillScoreHigh: 0,
        targetCandidateType: 0,
        targetMajor: [],
        workDays: [],
        workHours: [],

        //todo-ky should this default to something better?
        gigExpirationDate: "",
        visaSponsorshipAvailable: false,
        address: {
            street1: "",
            street2: "",
            city: "",
            state: "",
            zip: "",
            timezoneId: ""
        }
    };
    return hostgigDefaultValues;
}
