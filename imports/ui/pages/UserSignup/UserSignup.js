import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CareersCollection from '../../../api/Careers/Careers';
import Candidate from '../../../api/Candidates/Candidates';
import Employees from '../../../api/Employees/Employees';
import Companies from '../../../api/Companies/Companies';
import Loading from '../../components/Loading/Loading';
import UserSignup from '../../components/UserProfile/UserSignup';
import WhiteBoxBody from '../../components/Shared/Wrappers/WhiteBoxBody';
import NullChecks from '../../methods/NullChecks';
import UserEnums from '../../../api/Users/enums';
import CandidateEnums from '../../../api/Candidates/enums';
import CompanyEnums from '../../../api/Companies/enums';

import './Stepzilla.less';
import '/node_modules/react-bootstrap-typeahead/css/Typeahead.css';
import '../../components/CompanySignup/CompanyCroppingModal.less';

const renderUserSignup = ({ loading,
                              careers,
                              match,
                              history,
                              userRole,
                              candidate,
                              company,
                              employee }) =>
    (!loading ? (
        <WhiteBoxBody size="lg" additionalOuterClasses="stepzilla-steps">
            <UserSignup careerArray={careers}
                        isOnSignupView={true}
                        userRole={userRole}
                        candidateObj={candidate}
                        companyObj={company}
                        employeeObj={employee}
                        history={history}
                        match={match} />
        </WhiteBoxBody>
    ) : <Loading />);

renderUserSignup.propTypes = {
    loading: PropTypes.bool.isRequired,
    careers: PropTypes.arrayOf(PropTypes.object),
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default createContainer((props) => {
    const userRoles = UserEnums.USER_ROLE_ENUM;
    const candidateSignupEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;
    const companySignupEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;
    let currentUserRole = props.userRole;
    const { history } = props;

    if (Meteor.userId()) {
        let userObj = Meteor.users.find().fetch();
        if (userObj && userObj[0]) {
            if(Roles.userIsInRole(userObj[0], userRoles.candidate)) {
                currentUserRole = userRoles.candidate;
            } else if(Roles.userIsInRole(userObj[0], userRoles.companyAdmin)) {
                currentUserRole = userRoles.company;
            }
        }
    }

    if (currentUserRole === userRoles.candidate) {
        const careerSubscription = Meteor.subscribe('careers');

        if (Meteor.userId()) {
            const candidateSubscription = Meteor.subscribe('candidate.view.byUserId', Meteor.userId());
            // const userSubscription = Meteor.subscribe('user.view', Meteor.userId());
            let userObj = Meteor.users.find().fetch();
            let candidate = Candidate.find({'userId': Meteor.userId()}).fetch();
            let hasCompletedSignup = false;

            //todo-ky findone
            if (!NullChecks.isNullOrEmptyArray(candidate) && candidate[0].completedSignUpSteps) {
                hasCompletedSignup = (_.max(candidate[0].completedSignUpSteps) == candidateSignupEnums.uploadPicture.enum);
            }

            if (hasCompletedSignup) {
                if(userObj && userObj[0] && userObj[0].emails && userObj[0].emails[0].verified) {
                    window.location = "/edit-profile";
                    return;
                }
            }

            return {
                loading: !careerSubscription.ready() || !candidateSubscription.ready(),
                careers: CareersCollection.find().fetch(),
                userObj: userObj,
                userRole: currentUserRole,
                candidate: candidate,
            };
        } else {
            return {
                loading: !careerSubscription.ready(),
                careers: CareersCollection.find().fetch(),
                userRole: currentUserRole
            };
        }
    }

    else if (currentUserRole === userRoles.company/* || currentUserRole === userRoles.employee || currentUserRole === userRoles.companyAdmin*/) {
        const careerSubscription = Meteor.subscribe('careers');

        if (Meteor.userId()) {
            const employeeSubscription = Meteor.subscribe('employees.view.byUserId', Meteor.userId());
            const employee = Employees.find({userId: Meteor.userId()}).fetch();

            let companySubscription = Meteor.subscribe('companies.view', employeeSubscription.ready() ? employee[0].companyId : '');
            let userObj = Meteor.users.find().fetch();
            let company = Companies.find({_id: employeeSubscription.ready() ? employee[0].companyId : ''}).fetch();
            let hasCompletedSignup = false;

            //todo-ky findone
            if (!NullChecks.isNullOrEmptyArray(company) && company[0].completedSignUpSteps) {
                hasCompletedSignup = (_.max(company[0].completedSignUpSteps) == companySignupEnums.photosInfo.enum);
            }

            if (hasCompletedSignup) {
                if (!NullChecks.isNullOrEmptyArray(userObj) && userObj[0].emails && userObj[0].emails[0].verified) {
                    window.location = "/dashboard";
                    return;
                } else {
                    window.location = "/successful-registration";
                }
            }

            return {
                loading: !employeeSubscription.ready() || !companySubscription.ready() || !careerSubscription.ready(),
                userObj: Meteor.users.find().fetch(),
                userRole: currentUserRole,
                employee: employee,
                company: company,
                careers: CareersCollection.find().fetch()
            };
        } else {
            return {
                loading: !careerSubscription.ready(),
                userRole: currentUserRole,
                careers: CareersCollection.find().fetch()
            };
        }
    }
    else {
        return {
            loading: false,
            userRole: currentUserRole
        };
    }

}, renderUserSignup);
