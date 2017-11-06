export function getCompanyDefaultValues() {
    const companyDefaultValues = {
        companyName: "",
        pitchVideo: "",
        website: "",

        //agreements all candidates need to agree to for gigs
        universalAgreements: [],

        generalGigDocuments: [],
        address: {
            street1: "",
            street2: "",
            city: "",
            state: "",
            zip: "",
            timezoneId: ""
        },
        photos: {
            //coverPhoto: "",
            profilePhotos: [],
            mainProfilePhoto: "",
            companyLogo: ""
        },
        details: {
            benefits: [],
            tagLine: "",
            description: "",
            culture: "",
            companySize: [],
            coreValues: [],
            funFact: "",
            industry: 0
        },
        isVisible: true,
        completedSignUpSteps: []
    };
    return companyDefaultValues;
}
