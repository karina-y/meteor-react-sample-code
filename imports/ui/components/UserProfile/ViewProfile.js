/*
created by: karina
created date: 10/4/17
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Row,
    Col,
    Button,
    Grid }
    from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import '../Shared/SideNavBar.less';
import './PublicProfile.less';
import WhiteBoxBody from '../Shared/Wrappers/WhiteBoxBody';
import CandidatePublicProfile from './CandidatePublicProfile';
import CompanyPublicProfile from './CompanyPublicProfile';
import NotFound from '../../pages/NotFound/NotFound';
import UserEnums from '../../../api/Users/enums';

const userRoles = UserEnums.USER_ROLE_ENUM;


class ViewProfile extends React.Component {
    constructor(props) {
        super();

        this.state = {
            userRole: props.userRole,
            userProfile: props.userProfile,
            companyObj: props.userProfile,
            candidateObj: props.userProfile,
            employeeObj: props.companyAdminProfile,
            careerArray: props.careerArray,
            hostgigs: props.hostgigs,
            isOnSignupView: props.isOnSignupView,
            viewingOwnProfile: props.viewingOwnProfile
        };
    }

    render() {

        return (
            this.state.userRole === userRoles.candidate ?

                <CandidatePublicProfile userRole={this.state.userRole}
                                        userProfile={this.state.candidateObj}
                                        careerArray={this.state.careerArray}
                                        hostgigs={this.state.hostgigs}
                                        isOnSignupView={this.state.isOnSignupView}
                                        viewingOwnProfile={this.state.viewingOwnProfile} />

                :

                this.state.userRole === userRoles.company ?

                    <CompanyPublicProfile userRole={this.state.userRole}
                                          userProfile={this.state.companyObj}
                                          companyAdminProfile={this.state.employeeObj}
                                          hostgigs={this.state.hostgigs}
                                          isOnSignupView={this.state.isOnSignupView}
                                          viewingOwnProfile={this.state.viewingOwnProfile} />

                    :

                    this.state.userRole === userRoles.employee ?

                        //not yet implemented, putting not found for now
                        <NotFound />

                        :

                        <NotFound />
        )
    }
}


ViewProfile.propTypes = {
    userRole:PropTypes.string.isRequired,
    userProfile: PropTypes.object.isRequired,
    companyAdminProfile: PropTypes.object,
    targetUserData: PropTypes.object,
    careerArray: PropTypes.array.isRequired,
    hostgigs: PropTypes.array,
    isOnSignupView: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
    viewingOwnProfile: PropTypes.bool.isRequired
};

export default ViewProfile;
