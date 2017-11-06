import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import NullChecks from '../../../methods/NullChecks';
import NotFound from '../../../pages/NotFound/NotFound';
import UserEnums from '../../../../api/Users/enums';
import CandidateEnums from '../../../../api/Candidates/enums';
import CompanyEnums from '../../../../api/Companies/enums';
import EmployeeEnums from '../../../../api/Employees/enums';
import SignupCompleted from "./SignupCompleted";
import Agreements from "../../Agreements/Agreements";

const userRoles = UserEnums.USER_ROLE_ENUM;
const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;
const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;
const employeeSignupStepEnums = EmployeeEnums.EMPLOYEE_SIGNUP_ENUM;

/*
isEditingProfile                - only necessary for redirects to profile, editprofile, and usersignup (depending on usage)
checkTargetUserVerification     - used when the client is viewing another user's profile, this is to check if the user they're viewing has verified their own profile, agreed to terms, completed signup etc etc
checkAuthorization              - used if this is a page that only certain roles can see
 */

const BulletProof = ({ loggingIn,
                         authenticated,
                         component,
                         isEditingProfile,
                         checkTargetUserVerification,
                         checkAuthorization,
                         match,
                         ...rest }) => (
    <Route
        {...rest}
        render={
            (props) => {
                if (loggingIn) {
                    return <div />;
                }

                //first check if they're authenticated
                if (!authenticated) {
                    return (<Redirect to="/login" />);
                }

                const userObj = rest.user;

                let userProfile;
                let finalSignupStep;
                let redirectTo = "/user-signup";
                const isCandidate = Roles.userIsInRole(userObj, userRoles.candidate);
                const isCompanyAdmin = Roles.userIsInRole(userObj, userRoles.companyAdmin);
                const isEmployee = Roles.userIsInRole(userObj, userRoles.employee);


                let userEmailExists = (userObj && !NullChecks.isNullOrEmptyArray(userObj.emails));
                let userVerified = userEmailExists ? userObj.emails[0].verified : false;
                let signupCompleted;
                let allTermsAgreed;
                let authorized = false;


                //put these all in functions so we can reuse for checkTargetUserVerification

                //getting the user's final signup step and whether or not they've agreed to all their terms
                //candidate's final signup step
                if (isCandidate) {
                    finalSignupStep = candidateSignupStepEnums.uploadPicture.enum;
                    userProfile = userObj.candidate();

                    //candidate verifications here
                    allTermsAgreed = userObj.agreements.agreedToTerms && userObj.agreements.agreedToPrivacyPolicy && userObj.agreements.agreedToBonusTerms;
                }
                //company admin final signup step
                else if (isCompanyAdmin) {
                    userProfile = userObj.employee();

                    //companyadmin verifications here
                    allTermsAgreed = userObj.agreements.agreedToTerms && userObj.agreements.agreedToPrivacyPolicy && userObj.agreements.agreedToContract;

                    //checks to see if the employee has finished signing up:
                    if (userObj.createdByAdmin) {
                        //company admin user was signed up by company admin and has not finish their signup/reset their pw + confirm to terms/conditions
                        finalSignupStep = employeeSignupStepEnums.confirmedByEmployee.enum;
                        redirectTo = "/finish-employee-signup";
                    } else {
                        //get company profile from userProfile.employeeId
                        userProfile = userObj.company();
                        finalSignupStep = companySignupStepEnums.photosInfo.enum;
                        redirectTo = "/company-signup";
                    }
                }
                //employee final signup step
                else if (isEmployee) {
                    finalSignupStep = employeeSignupStepEnums.confirmedByEmployee.enum;
                    redirectTo = "/finish-employee-signup";

                    //employee verifications here
                    allTermsAgreed = userObj.agreements.agreedToTerms && userObj.agreements.agreedToPrivacyPolicy && userObj.agreements.agreedToContract;
                }

                signupCompleted = (_.max(userProfile.completedSignUpSteps) == finalSignupStep);

                // Add debug={true} to the instantiation in App.js to enable this logging
                if (rest.debug) {
                    console.log("User is Authenticated...");
                    console.log("Has user's email been verified? ", (userEmailExists) ? userObj.emails[0].verified : "User email/obj is null" + userObj );
                    console.log("User has the following roles:", Roles.getRolesForUser(userObj._id));
                    console.log("What steps has the user completed?", rest.userProfile.completedSignUpSteps);
                    console.log('User\'s final signup step is:', finalSignupStep);
                }


                //check if they've finished their signup steps
                if (!signupCompleted) {
                    return (<Redirect to={redirectTo} />);
                }

                //then check if email has been verified
                if (!userVerified) {
                    return (<Redirect to="/successful-registration" />);
                }

                //then check if they've agreed to their terms
                if (!allTermsAgreed) {
                    component = Agreements;
                    return (React.createElement(component, { ...props, ...rest, loggingIn, authenticated, userObj, isCandidate, isEmployee, isCompanyAdmin }));
                }

                //then check if they're authorized when necessary
                if (checkAuthorization) {
                    if (Array.isArray(rest.rolesAllowed)) {
                        _.each(rest.rolesAllowed,function(roleAllowed){
                            if (rest.roles.indexOf(roleAllowed) >= 0) {
                                authorized = true;
                            }
                        });
                    } else {
                        if (rest.roles.indexOf(rest.rolesAllowed) >= 0) {
                            authorized = true;
                        }
                    }

                    if (!authorized) {
                        Bert.alert("You are not authorized to see this page, please contact us if you have any questions.", 'danger');
                        return (<Redirect to="/" />);
                    }
                }


                //this prop only exists if the client is viewing another user's profile and need to be sure they're verified
                //if they ARE authorized, continue onto this code block if necessary, we'll redirect them to signupcompleted to check for the target user's viewability
                if (checkTargetUserVerification) {
                    const signupCompletedComponent = SignupCompleted;

                    return (React.createElement(signupCompletedComponent, { ...props, ...rest, loggingIn, authenticated, isEditingProfile, component }));
                }
                else {
                    return (React.createElement(component, { ...props, ...rest, loggingIn, authenticated, isEditingProfile }));
                }

            }
        }
    />
);

BulletProof.propTypes = {
    loggingIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    authenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired,
    isEditingProfile: PropTypes.bool.isRequired,
    checkTargetUserVerification: PropTypes.bool.isRequired,
    checkAuthorization: PropTypes.bool.isRequired
};

export default BulletProof;
