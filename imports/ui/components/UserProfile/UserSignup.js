import React from 'react';
import { Grid,
    Row,
    Col }
    from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import StepZilla from 'react-stepzilla';
import { convertToArrayOfStrings,
    convertToString,
    convertToInt,
    convertIntOrStringToEnum,
    formatCandidateObj,
    formatEmployeeObj,
    formatCompanyObj,
    formatHostgigObj }
    from './TypeaheadHelpers';
import BasicInfo from '../Shared/Signup/BasicInfo';
import PersonalInfo from './PersonalInfo';
import Education from './Education';
import JobHistoryAndSkills from './JobHistoryAndSkills';
import UploadProfilePicture from './UploadProfilePicture';
import RolesAndExperience from './RolesAndExperience';

import { getCandidateDefaultValues } from './DropdownData/CandidateDefaults';
import { getCompanyDefaultValues } from '../CompanySignup/DropdownData/CompanyDefaults';
import { getEmployeeDefaultValues } from '../CompanySignup/DropdownData/EmployeeDefaults';
import { getHostgigDefaultValues } from '../CompanySignup/DropdownData/HostgigDefaults';
import EmployeeInfo from "../CompanySignup/EmployeeInfo";
import CompanyInfo from "../CompanySignup/CompanyInfo";
import HostgigInfo from "../CompanySignup/HostgigInfo";
import CompanyLogo from "../CompanySignup/CompanyLogo";
import PicturesForPublicProfile from '../CompanySignup/PublicProfilePictures'

import AdminBetagig from "../Admin/AdminBetagig";
import '../Shared/Signup/Signup.less';
import '../CompanySignup/CompanyCroppingModal.less';
import NullChecks from '../../methods/NullChecks';

//enums
import CompanyEnums from '/imports/api/Companies/enums';
import CandidateEnums from '/imports/api/Candidates/enums';
import UserEnums from '../../../api/Users/enums';
import SharedEnums from '../../../api/Shared/enums';

const userRoles = UserEnums.USER_ROLE_ENUM;
const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;
const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;
const workAuthStatusEnums = SharedEnums.WORK_AUTH_ENUM;
const educationLevelEnums = SharedEnums.EDUCATION_LEVEL_ENUM;
const experienceLevelEnums = SharedEnums.EXPERIENCE_LEVEL_ENUM;

class UserSignup extends React.Component {

    constructor(props) {
        super(props);
        this.updateUserValues = this.updateUserValues.bind(this);
        this.updateCandidateValues = this.updateCandidateValues.bind(this);
        this.updateCompanyAndEmployeeValues = this.updateCompanyAndEmployeeValues.bind(this);
        this.onSaveSuccessOfUserOrProfile = this.onSaveSuccessOfUserOrProfile.bind(this);
        this.updateCurrentStep = this.updateCurrentStep.bind(this);
        this.updateCompletedSignUpSteps = this.updateCompletedSignUpSteps.bind(this);

        let candidateObjArr = props.candidateObj ? props.candidateObj : null;
        let candidateObj;
        let candidateId;

        let employeeObjArr = props.employeeObj ? props.employeeObj : null;
        let employeeObj;
        let employeeId;

        let companyObjArr = props.companyObj ? props.companyObj : null;
        let companyObj;
        let companyId;

        let userObj = Meteor.user();
        let profileObj;

        //check to see if user has already created a partial account with us and bring them up to their last saved step
        if (!NullChecks.isNullOrEmptyArray(candidateObjArr)) {
            candidateId = candidateObjArr[0]._id;
            candidateObj = _.omit(candidateObjArr[0], ['createdAt', 'updatedAt', '_id' , 'skillScore', 'hostgigsAllowed', 'hideBrowse', 'user']);

            formatCandidateObj(candidateObj);
        }

        if (!NullChecks.isNullOrEmptyArray(employeeObjArr)) {
            employeeId = employeeObjArr[0]._id;
            employeeObj = _.omit(employeeObjArr[0], ['createdAt', 'updatedAt', '_id']);

            formatEmployeeObj(employeeObj);
        }

        if (!NullChecks.isNullOrEmptyArray(companyObjArr)) {
            companyId = companyObjArr[0]._id;
            companyObj = _.omit(companyObjArr[0], ['createdAt', 'updatedAt', '_id']);

            formatCompanyObj(companyObj);
        }

        //assign the pertinent specific user's obj to variable so we don't need a million if statements
        switch(props.userRole) {
            //only grabbing company's signupsteps because you can't sign up as an employee
            case userRoles.company /*|| userRoles.employee || userRoles.companyAdmin*/:
                profileObj = companyObj;

                break;
            case userRoles.candidate:
                profileObj = candidateObj;
                break;
        }

        let completedSignupStep = (
            profileObj &&
            profileObj.completedSignUpSteps &&
            profileObj.completedSignUpSteps.length > 0 &&
            this.props.isOnSignupView
        ) ? (_.max(profileObj.completedSignUpSteps)) : candidateSignupStepEnums.none.enum;

        let referralCode = (this.props.match && this.props.match.params && this.props.match.params && this.props.match.params.id ) ? this.props.match.params.id : '';

        this.state = {
            referralCode: referralCode,
            userSignedUpButIncompleteProfile: (profileObj) ? true : false,
            currentStep: completedSignupStep, //(!profileObj && completedSignupStep > 0) ? (completedSignupStep - 1) : completedSignupStep,
            userCreated: (profileObj) ? true : false, //will be TRUE after step 1
            specificUserCreated: (profileObj) ? true : false, //will be TRUE after step 2
            candidateId: (candidateId) ? candidateId : null,
            employeeId: (employeeId) ? employeeId : null,
            companyId: (companyId) ? companyId : null,
            userId: (profileObj && profileObj.userId) ? profileObj.userId : null,
            userObj: {
                firstName: (userObj && userObj.profile) ? userObj.profile.name.first : "",
                middleName: (userObj && userObj.profile) ? userObj.profile.name.middle : "",
                lastName: (userObj && userObj.profile) ? userObj.profile.name.last : "",
                email: (userObj && userObj.emails) ? userObj.emails[0].address: "",
                password: "",
                confirmPassword: "",
                agreements: userObj != null ? userObj.agreements :
                    {
                        agreedToContract: false,
                        agreedToPrivacyPolicy: false,
                        agreedToTerms: false,
                        agreedToBonusTerms: false,
                        agreedToContractDate: "",
                        agreedToPrivacyPolicyDate: "",
                        agreedToTermsDate: "",
                        agreedToBonusTermsDate: ""
                    }
            },
            candidateObj: (candidateObj) ? _.extend(getCandidateDefaultValues(), candidateObj) : getCandidateDefaultValues(),
            companyObj: (companyObj) ? _.extend(getCompanyDefaultValues(), companyObj) : getCompanyDefaultValues(),
            employeeObj: (employeeObj) ? _.extend(getEmployeeDefaultValues(), employeeObj) : getEmployeeDefaultValues(),
            hostgigObj: getHostgigDefaultValues()
        };
    }

    updateUserValues(dataCollected) {
        const currentUser = {...this.state.userObj};
        const updatedUser = Object.assign(currentUser, dataCollected);

        this.setState({
            userObj: updatedUser
        });
    }

    //todo-ky&&an clean up the updates and externalize them
    updateCandidateValues(dataCollected, isOnLastStep, willUpdateCandidateInDb) {
        let component = this;
        const currentCandidate = {...this.state.candidateObj};
        const originalDataCollected = JSON.parse(JSON.stringify(dataCollected)); //creates a DEEP COPY to keep an original version copy of the incoming data
        let updatedCandidate = Object.assign(currentCandidate, originalDataCollected);
        let currentNameOfStep;

        if (this.state.specificUserCreated == true && willUpdateCandidateInDb == true) {
            //Massaging data before saving to database - handles typeahead elements only:
            switch (this.state.currentStep) {
                //Personal Info - format WORKAUTHSTATUS, JOBSEARCHSTATUS
                case candidateSignupStepEnums.personalInfo.enum:
                    currentNameOfStep = candidateSignupStepEnums.personalInfo.enum;

                    dataCollected.workAuthStatus = convertIntOrStringToEnum(workAuthStatusEnums, dataCollected.workAuthStatus);

                    dataCollected.jobSearchStatus = convertToString(dataCollected.jobSearchStatus);
                    break;

                //Education - format SCHOOL,MAJOR,DEGREETYPE in every object in educationBackground
                case candidateSignupStepEnums.education.enum:
                    //dataCollected will be an empty object if user skips the step - but we still want to mark this step as completed
                    if (_.isEmpty(dataCollected) == false) {
                        let propsToReformatArr = ["school", "major", "degreeType"];

                        _.each(dataCollected.educationBackground, function (edu, index) {

                            delete dataCollected.educationBackground[index].isValid;

                            _.each(propsToReformatArr, function (prop) {
                                if (!NullChecks.isNullOrEmptyArray(edu[prop]) && prop === "degreeType") {
                                    dataCollected.educationBackground[index][prop] = convertIntOrStringToEnum(educationLevelEnums, edu[prop]);
                                }
                                else {
                                    dataCollected.educationBackground[index][prop] = convertToString(edu[prop]);
                                }
                            });
                        });

                    }

                    currentNameOfStep = candidateSignupStepEnums.education.enum;
                    break;

                //Job History & Skills - format GENDER,LANGUAGEARRAY
                case candidateSignupStepEnums.jobHistorySkills.enum:
                    currentNameOfStep = candidateSignupStepEnums.jobHistorySkills.enum;
                    let gender = dataCollected.gender;
                    let languageArray = dataCollected.languageArray;

                    if (!NullChecks.isNullOrEmptyArray(gender)) {
                        dataCollected.gender = convertToString(dataCollected.gender);
                    }
                    else {
                        delete dataCollected.gender;
                    }

                    if (!NullChecks.isNullOrEmptyArray(languageArray)) {
                        dataCollected.languageArray = convertToArrayOfStrings(dataCollected.languageArray);
                    }

                    break;

                //Roles & Experience - format TOPFIVESKILLSARRAY,YEARSOFEXP, DESIREDROLE
                case candidateSignupStepEnums.rolesExperience.enum:
                    currentNameOfStep = candidateSignupStepEnums.rolesExperience.enum;
                    dataCollected.topFiveSkillsArray = convertToArrayOfStrings(dataCollected.topFiveSkillsArray);
                    dataCollected.yearsOfExp = convertIntOrStringToEnum(experienceLevelEnums, dataCollected.yearsOfExp);
                    dataCollected.desiredRole = convertToString(dataCollected.desiredRole);
                    break;

                case candidateSignupStepEnums.uploadPicture.enum:
                    currentNameOfStep = candidateSignupStepEnums.uploadPicture.enum;
                    break;
            }

            let returnedArray = this.updateCompletedSignUpSteps(userRoles.candidate, currentNameOfStep);

            if (returnedArray) {
                let tempObj = {
                    candidateId: this.state.candidateId,
                    completedSignUpSteps: returnedArray
                };

                let dataToSendPlusCandidateId = _.extend(dataCollected, tempObj);

                Meteor.call('candidates.update', dataToSendPlusCandidateId, (error, candidateId) => {
                    if (error) {
                        Bert.alert(error.reason, 'danger');
                    } else {
                        if (this.props.isOnSignupView == false || currentNameOfStep != candidateSignupStepEnums.uploadPicture.enum) {
                            Bert.alert('Successfully saved!', 'success');
                        } else {
                            if (isOnLastStep == true && this.props.isOnSignupView) {
                                Bert.alert('And that\'s a wrap!', 'success');
                                Meteor.call('sendVerificationLink', (error, response) => {

                                    if (error) {
                                        Bert.alert(error, 'danger');
                                    } else {

                                        if (this.state.referralCode != '') {
                                            Meteor.call('referFriend.update', {
                                                id: this.state.referralCode,
                                                referralRegistered: true,
                                                userId: Meteor.userId()
                                            });
                                        }

                                        setTimeout(function () {
                                            component.props.history.push("/successful-registration");
                                        }, 1000);
                                    }
                                });
                            }
                        }
                    }

                });
            }

            this.setState({
                candidateObj: updatedCandidate
            });
        }
    }

    updateCompanyAndEmployeeValues(dataCollected, isOnLastStep, willUpdateEmployeeInDb) {
        const component = this;
        const originalDataCollected = {...dataCollected};

        const currentEmployee = {...this.state.employeeObj};
        const currentCompany = {...this.state.companyObj};
        const currentHostgig = {...this.state.hostgigObj};

        let updatedEmployee = currentEmployee;
        let updatedCompany = currentCompany;
        let updatedHostgig = currentHostgig;

        if (this.props.isOnSignupView) {
            updatedEmployee = Object.assign(currentEmployee, originalDataCollected);
            updatedCompany = Object.assign(currentCompany, originalDataCollected);
            updatedHostgig = Object.assign(currentHostgig, originalDataCollected);
        }

        let currentNameOfStep;
        let methodToCall;
        let methodToCallId;
        let dataToSendPlusPertinentId;
        let companyUpdateObj = {};
        const companyId = this.state.companyId;

        //user just saved their last step
        let allSignupStepsCompleted = [
            companySignupStepEnums.basicInfo.enum,
            companySignupStepEnums.employeeInfo.enum,
            companySignupStepEnums.companyInfo.enum,
            companySignupStepEnums.hostgigInfo.enum,
            companySignupStepEnums.companyLogo.enum,
            companySignupStepEnums.photosInfo.enum
        ];

        function updateCb(state) {
            if (!component.props.isOnSignupView || state.currentStep != companySignupStepEnums.photosInfo.enum ||
                state.currentStep == companySignupStepEnums.photosInfo.enum && !isOnLastStep) {
                Bert.alert('Successfully saved!', 'success');
            }
            else {
                if (isOnLastStep == true && component.props.isOnSignupView) {
                    Bert.alert('And that\'s a wrap!', 'success');

                    Meteor.call('sendVerificationLink', (error, response) => {
                        if (error) {
                            Bert.alert(error, 'danger');
                        } else {

                            if (state.referralCode != '') {
                                Meteor.call('referFriend.update', {
                                    id: state.referralCode,
                                    referralRegistered: true,
                                    userId: Meteor.userId()
                                });
                            }

                            setTimeout(function () {
                                window.location = "/successful-registration";
                            }, 1000);
                        }
                    });
                }
            }
        }

        function updateCompanySteps(state, returnedArray) {
            //on success send over the new completed steps to company
            companyUpdateObj.completedSignUpSteps = returnedArray;
            if (!companyUpdateObj.companyId) {
                companyUpdateObj.companyId = state.companyId;
            }

            //if we did employee, run this, else just success func
            Meteor.call("companies.update", companyUpdateObj, (error) => {
                if (error) {
                    Bert.alert(error.reason, 'danger');
                }
                else {
                    updateCb(state);
                }
            });
        }

        function updateSuccessfulSetState(onSignupView, company, employee, hostgig) {
            if(onSignupView) {
                switch (currentNameOfStep) {
                    case companySignupStepEnums.companyInfo.enum:
                        component.setState({
                            companyObj: company
                        });
                        break;
                    case companySignupStepEnums.employeeInfo.enum:
                        component.setState({
                            employeeObj: employee
                        });
                        break;
                    case companySignupStepEnums.hostgigInfo.enum:
                        component.setState({
                            hostgigObj: hostgig
                        });
                        break;
                    case companySignupStepEnums.companyLogo.enum:
                        component.setState({
                            companyObj: company
                        });
                        break;
                    case companySignupStepEnums.photosInfo.enum:
                        component.setState({
                            companyObj: company
                        });
                        break;
                }
            }

            else {
                component.setState({
                    employeeObj: updatedEmployee,
                    companyObj: updatedCompany,
                    hostgigObj: updatedHostgig
                });
            }
        }

        if (this.state.specificUserCreated == true && willUpdateEmployeeInDb == true && dataCollected != null) {
            //Massaging data before saving to database - handles typeahead elements only:
            switch (this.state.currentStep) {

                //employee info - update employee
                case companySignupStepEnums.employeeInfo.enum:

                    //for this case we need a new object to send over to companies update to update the completed signup steps
                    companyUpdateObj._id = companyId;

                    currentNameOfStep = companySignupStepEnums.employeeInfo.enum;
                    methodToCall = "employees.update";
                    methodToCallId = this.state.employeeId;
                    updatedEmployee = Object.assign(currentEmployee, originalDataCollected);

                    dataCollected.details.phoneNumberType = convertToString(dataCollected.details.phoneNumberType);

                    break;

                //company info - update company
                case companySignupStepEnums.companyInfo.enum:
                    currentNameOfStep = companySignupStepEnums.companyInfo.enum;
                    methodToCall = "companies.update";
                    methodToCallId = companyId;
                    updatedCompany = Object.assign(currentCompany, originalDataCollected);

                    dataCollected.details.companySize = convertToString(dataCollected.details.companySize);

                    break;

                //job posting - create job posting
                case companySignupStepEnums.hostgigInfo.enum:
                    companyUpdateObj._id = companyId;

                    currentNameOfStep = companySignupStepEnums.hostgigInfo.enum;
                    methodToCall = "signup.hostgigs.insert";
                    methodToCallId = companyId;
                    updatedHostgig = Object.assign(currentHostgig, originalDataCollected);

                    dataCollected.companyId = companyId;

                    let desiredSkillsArray = dataCollected.skillsNeeded;

                    dataCollected.educationLevel = convertIntOrStringToEnum(educationLevelEnums, dataCollected.educationLevel);
                    dataCollected.experienceLevel = convertIntOrStringToEnum(experienceLevelEnums, dataCollected.experienceLevel);
                    dataCollected.careerId = convertToString(dataCollected.careerId);

                    if (!NullChecks.isNullOrEmptyArray(desiredSkillsArray)) {
                        dataCollected.skillsNeeded = convertToArrayOfStrings(dataCollected.skillsNeeded);
                    }
                    break;

                //company logo - update company
                case companySignupStepEnums.companyLogo.enum:
                    currentNameOfStep = companySignupStepEnums.companyLogo.enum;
                    methodToCall = "companies.update";
                    methodToCallId = companyId;
                    _.extend(currentCompany.photos, originalDataCollected.photos);
                    updatedCompany = currentCompany;
                    break;

                //pictures for public profile - update company
                case companySignupStepEnums.photosInfo.enum:
                    currentNameOfStep = companySignupStepEnums.photosInfo.enum;
                    methodToCall = "companies.update";
                    methodToCallId = companyId;
                    console.log('currentCompany', currentCompany, 'og data:', originalDataCollected)
                    updatedCompany = currentCompany;
                    break;
            }

            let returnedArray = this.updateCompletedSignUpSteps(this.props.userRole, currentNameOfStep);

            if (returnedArray) {
                let tempObj = {
                    _id: methodToCallId
                };

                if (this.props.isOnSignupView) {
                    tempObj.completedSignUpSteps = returnedArray;
                } 

                if (methodToCall !== "signup.hostgigs.insert") {
                    dataToSendPlusPertinentId = _.extend(dataCollected, tempObj);
                }
                else {
                    dataToSendPlusPertinentId = dataCollected;
                }

                //if dataCollected is null, they chose to skip the final step
                if (dataCollected == null) {
                    updateCb(this.state);
                } else {
                    //need to conditionally set the update call value and the id based on the step
                    Meteor.call(methodToCall, dataToSendPlusPertinentId, (error) => {
                        console.log(methodToCall);
                        if (error) {
                            Bert.alert(error.reason, 'danger');
                        }
                        else if (methodToCall !== "companies.update") {

                            if (isOnLastStep || currentNameOfStep == companySignupStepEnums.photosInfo.enum) {
                                //user just saved their last step
                                returnedArray = allSignupStepsCompleted;
                            }

                            updateCompanySteps(this.state, returnedArray);
                            updateSuccessfulSetState(this.props.isOnSignupView, updatedCompany, updatedEmployee, updatedHostgig);
                        }
                        else {
                            updateCb(this.state);
                            updateSuccessfulSetState(this.props.isOnSignupView, updatedCompany, updatedEmployee, updatedHostgig);
                        }
                    });
                }

            }

            if(this.props.isOnSignupView) {
                switch (currentNameOfStep) {
                    case companySignupStepEnums.companyInfo.enum:
                        this.setState({
                            companyObj: updatedCompany
                        });
                        break;
                    case companySignupStepEnums.employeeInfo.enum:
                        this.setState({
                            employeeObj: updatedEmployee
                        });
                        break;
                    case companySignupStepEnums.hostgigInfo.enum:
                        this.setState({
                            hostgigObj: updatedHostgig
                        });
                        break;
                    case companySignupStepEnums.companyLogo.enum:
                        this.setState({
                           companyObj: updatedCompany
                        });
                        break;
                    case companySignupStepEnums.photosInfo.enum: 
                        this.setState({
                            companyObj: updatedCompany
                        });
                }
            }

            else {
                this.setState({
                    employeeObj: updatedEmployee,
                    companyObj: updatedCompany,
                    hostgigObj: updatedHostgig
                });
            }
        }
        else if (isOnLastStep && !willUpdateEmployeeInDb) {
            updateCompanySteps(this.state, allSignupStepsCompleted);
        }

    }

    onSaveSuccessOfUserOrProfile(userRole, objOfReturnedIds) {

        this.setState({
            userCreated: true
        });

        let updatedStateObj = {};

        switch(userRole) {
            case userRoles.candidate:
                updatedStateObj = {
                    specificUserCreated: true,
                    candidateId: objOfReturnedIds.candidate.id,
                    userId: objOfReturnedIds.user.id
                };
                break;
            case /*userRoles.company || userRoles.employee ||*/ userRoles.companyAdmin:
                updatedStateObj = {
                    specificUserCreated: true,
                    employeeId: objOfReturnedIds.employee.id,
                    companyId: objOfReturnedIds.company.id,
                    hostgigId: objOfReturnedIds.hostgig.id,
                    userId: objOfReturnedIds.user.id
                };
                break;
            default:
                break;
        }

        //do we even need a specific variable? we could just say specific user created and check the role to figure out which table to query
        if (userRole != null) {
            this.setState(updatedStateObj);
        }
    }

    updateCurrentStep(step) {
        this.setState({
            currentStep: step
        });
    }

    updateCompletedSignUpSteps(userSignUpRole, stepCompleted) {
        let targetedCompletedSignUpSteps;

        switch(userSignUpRole) {
            case userRoles.candidate:
                targetedCompletedSignUpSteps = this.state.candidateObj.completedSignUpSteps;
                break;
            case userRoles.company:
                targetedCompletedSignUpSteps = this.state.companyObj.completedSignUpSteps;
                break;
            // case userRoles.employee:
            //     targetedCompletedSignUpSteps = this.state.employeeObj.completedSignUpSteps;
            //     break;
        }

        if (targetedCompletedSignUpSteps == null) {
            targetedCompletedSignUpSteps = [];
        }

        targetedCompletedSignUpSteps.push(stepCompleted);

        this.setState({
            targetedCompletedSignUpSteps: targetedCompletedSignUpSteps
        });

        return _.uniq(targetedCompletedSignUpSteps);
    }

    render() {
        //components we will be using for the Stepzilla library - https://github.com/newbreedofgeek/react-stepzilla
        let steps = [
            {
                name: 'Basic Info',
                component: <BasicInfo userObj={this.state.userObj}
                                      userCreated={this.state.userCreated}
                                      updateUserValues={this.updateUserValues}
                                      onSaveSuccessOfUserOrProfile={this.onSaveSuccessOfUserOrProfile}
                                      updateCurrentStep={this.updateCurrentStep}
                                      userRole={this.props.userRole}
                                      updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                      termsAndPrivacyAgreed={this.state.termsAndPrivacyAgreed}
                                      bonusTermsAgreed={this.state.bonusTermsAgreed}
                                      contractAgreed={this.state.contractAgreed}
                                      isOnSignupView={this.props.isOnSignupView}
                                      userSignedUpButIncompleteProfile={this.state.userSignedUpButIncompleteProfile}
                                      isAnonymous={this.state.candidateObj.isAnonymous || false} />
            }
        ];

        const candidateSteps = [
            {
                name: 'Personal Info',
                component: <PersonalInfo candidateObj={this.state.candidateObj}
                                         specificUserCreated={this.state.specificUserCreated}
                                         updateCandidateValues={this.updateCandidateValues}
                                         onSaveSuccessOfUserOrProfile={this.onSaveSuccessOfUserOrProfile}
                                         updateCurrentStep={this.updateCurrentStep}
                                         updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                         isOnSignupView={this.props.isOnSignupView} />
            },
            {
                name: 'Education',
                component: <Education candidateObj={this.state.candidateObj}
                                      updateCandidateValues={this.updateCandidateValues}
                                      educationBackground={this.state.educationBackground}
                                      updateCurrentStep={this.updateCurrentStep}
                                      updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                      isOnSignupView={this.props.isOnSignupView} />
            },
            {
                name: 'Job History + Skills',
                component: <JobHistoryAndSkills candidateObj={this.state.candidateObj}
                                                updateCurrentStep={this.updateCurrentStep}
                                                updateCandidateValues={this.updateCandidateValues}
                                                updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                                isOnSignupView={this.props.isOnSignupView}/>
            },
            {
                name: 'Roles + Experience',
                component: <RolesAndExperience careerArray={this.props.careerArray}
                                               candidateObj={this.state.candidateObj}
                                               updateCurrentStep={this.updateCurrentStep}
                                               updateCandidateValues={this.updateCandidateValues}
                                               updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                               isOnSignupView={this.props.isOnSignupView}/>
            },
            {
                name: 'Upload Picture',
                component: <UploadProfilePicture candidateObj={this.state.candidateObj}
                                                 updateCurrentStep={this.updateCurrentStep}
                                                 updateCandidateValues={this.updateCandidateValues}
                                                 updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                                 isOnSignupView={this.props.isOnSignupView} />
            }
        ];


        let companySteps = [
            {
                name: 'Employee Info',
                component: <EmployeeInfo employeeObj={this.state.employeeObj}
                                         companyObj={this.state.companyObj}
                                         specificUserCreated={this.state.specificUserCreated}
                                         updateCompanyAndEmployeeValues={this.updateCompanyAndEmployeeValues}
                                         onSaveSuccessOfUserOrProfile={this.onSaveSuccessOfUserOrProfile}
                                         updateCurrentStep={this.updateCurrentStep}
                                         updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                         isOnSignupView={this.props.isOnSignupView} />
            },
            {
                name: 'Company Info',
                component: <CompanyInfo employeeObj={this.state.employeeObj}
                                        companyObj={this.state.companyObj}
                                        educationBackground={this.state.educationBackground}
                                        updateCurrentStep={this.updateCurrentStep}
                                        updateCompanyAndEmployeeValues={this.updateCompanyAndEmployeeValues}
                                        updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                        isOnSignupView={this.props.isOnSignupView} />
            },
            {
                name: 'Create a Job Posting',
                component: <HostgigInfo hostgigObj={this.state.hostgigObj}
                                        careerArray={this.props.careerArray}
                                        employeeObj={this.state.employeeObj}
                                        companyObj={this.state.companyObj}
                                        updateCurrentStep={this.updateCurrentStep}
                                        updateCompanyAndEmployeeValues={this.updateCompanyAndEmployeeValues}
                                        updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                        isOnSignupView={this.props.isOnSignupView} />
            },
            {
                name: 'Company Logo',
                component: <CompanyLogo hostgigObj={this.state.hostgigObj}
                                        careerArray={this.props.careerArray}
                                        employeeObj={this.state.employeeObj}
                                        companyObj={this.state.companyObj}
                                        updateCurrentStep={this.updateCurrentStep}
                                        updateCompanyAndEmployeeValues={this.updateCompanyAndEmployeeValues}
                                        updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                        isOnSignupView={this.props.isOnSignupView} />
            },
            {
                name: 'Profile Images',
                component: <PicturesForPublicProfile hostgigObj={this.state.hostgigObj}
                                                     careerArray={this.props.careerArray}
                                                     employeeObj={this.state.employeeObj}
                                                     companyObj={this.state.companyObj}
                                                     updateCurrentStep={this.updateCurrentStep}
                                                     updateCompanyAndEmployeeValues={this.updateCompanyAndEmployeeValues}
                                                     updateCompletedSignUpSteps={this.updateCompletedSignUpSteps}
                                                     isOnSignupView={this.props.isOnSignupView} />
            }
        ];

        if (!this.props.isOnSignupView) {
            companySteps.splice(2, 1); //remove create a job posting if user is on editProfile
        }

        switch(this.props.userRole) {
            case userRoles.candidate:
                steps = steps.concat(candidateSteps);
                break;

            case userRoles.company:
                steps = steps.concat(companySteps);
                break;
        }

        //styling adjustments for dashboard profile
        let wrapperColClasses = "";
        if (this.props.isOnSignupView) {
            wrapperColClasses = "col-md-10 col-md-push-1";
        }

        return (
            <div className="user-signup">
                <Row className="show-grid">
                    <Col className={wrapperColClasses + " user-form-wrapper"}>
                        <div className='step-progress'>
                            <StepZilla
                                startAtStep={this.state.currentStep}
                                steps={steps}
                                showNavigation={false}
                                preventEnterSubmission={true}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

UserSignup.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    careerArray: PropTypes.array,
    match: PropTypes.object
};

export default UserSignup;
