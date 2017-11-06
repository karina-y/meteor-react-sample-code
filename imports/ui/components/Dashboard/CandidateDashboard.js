/*
created by: karina
created date: 10/11/17
*/

import React from 'react';
import BetagigListGroup from '../../components/BetagigListGroup/BetagigListGroup';
import Tabs from '../../components/Tabs/Tabs';
import Sticky from '../../components/Sticky/Sticky';
import SideNavBar from '../../components/Shared/SideNavBar';
import PropTypes from 'prop-types';
import NullChecks from '../../methods/NullChecks';
import { Alert,
    Button,
    Grid,
    Row,
    Col,
    Image,
    Tab,
    Nav,
    NavItem }
    from 'react-bootstrap';
import UserEnums from '../../../api/Users/enums';
import ShadowBox from "../Shared/Wrappers/ShadowBox";

const userRoles = UserEnums.USER_ROLE_ENUM;

class CandidateDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: props.loading,
            user: props.user,
            userType: props.userType,
            userProfile: props.userProfile,
            betagigs: props.betagigs,
            betagigs_upcoming: props.betagigs_upcoming,
            betagigs_pending: props.betagigs_pending,
            betagigs_completed: props.betagigs_completed,
            betagigs_applied: props.betagigs_applied,
            betagigs_screeningScheduled: props.betagigs_screeningScheduled
        }
    }

    render() {
        const user = this.state.user;
        const profilePicture = NullChecks.isNullOrEmpty(this.state.userProfile.profilePicture) ? "/images/default-user-100.png" : this.state.userProfile.profilePicture;

        return (
            <div className="dashboard">

                {/* name */}
                <Row className="no-margin-top welcome-header">
                    <Col xs={12}>
                        <h2 className="no-margin">Welcome, <span className="first-name">{user.profile.name.first}</span>!</h2>
                    </Col>
                </Row>

                {/* scheduled betagigs / scheduled screens */}
                <Row>
                    <ShadowBox hoverAction={false} popoutHover={false} bootstrapColClasses="col-md-6" shadowLevel={2}>
                        <div className="dashboard-card">
                            <Grid fluid>

                                {/* count */}
                                <Row>
                                    <Col xs={12}>
                                        <h1>{this.state.betagigs_upcoming.length}</h1>
                                    </Col>
                                </Row>

                                {/* title */}
                                <Row>
                                    <Col xs={12}>
                                        <h3>Scheduled Betagigs</h3>
                                    </Col>
                                </Row>

                                {/* button */}
                                <Row>
                                    <Col xs={12}>
                                        <a href="/my-jobs/0" className="btn btn-bg-orange btn-fat">Details</a>
                                    </Col>
                                </Row>

                            </Grid>
                        </div>
                    </ShadowBox>

                    <ShadowBox hoverAction={false} popoutHover={false} bootstrapColClasses="col-md-6" shadowLevel={2}>
                        <div className="dashboard-card">
                            <Grid fluid>

                                {/* count */}
                                <Row>
                                    <Col xs={12}>
                                        <h1>{this.state.betagigs_screeningScheduled.length}</h1>
                                    </Col>
                                </Row>

                                {/* title */}
                                <Row>
                                    <Col xs={12}>
                                        <h3>Scheduled Screens</h3>
                                    </Col>
                                </Row>

                                {/* button */}
                                <Row>
                                    <Col xs={12}>
                                        <a href="/my-jobs/1" className="btn btn-bg-orange btn-fat">Details</a>
                                    </Col>
                                </Row>

                            </Grid>
                        </div>
                    </ShadowBox>
                </Row>


                {/* completed betagigs / new applications */}
                <Row>

                    <ShadowBox hoverAction={false} popoutHover={false} bootstrapColClasses="col-md-6" shadowLevel={2}>
                        <div className="dashboard-card">
                            <Grid fluid>

                                {/* count */}
                                <Row>
                                    <Col xs={12}>
                                        <h1>{this.state.betagigs_applied.length}</h1>
                                    </Col>
                                </Row>

                                {/* title */}
                                <Row>
                                    <Col xs={12}>
                                        <h3>New Job Invites</h3>
                                    </Col>
                                </Row>

                                {/* button */}
                                <Row>
                                    <Col xs={12}>
                                        <a href="/my-jobs/2" className="btn btn-bg-orange btn-fat">Details</a>
                                    </Col>
                                </Row>

                            </Grid>
                        </div>
                    </ShadowBox>
                    <ShadowBox hoverAction={false} popoutHover={false} bootstrapColClasses="col-md-6" shadowLevel={2}>
                        <div className="dashboard-card">
                            <Grid fluid>

                                {/* count */}
                                <Row>
                                    <Col xs={12}>
                                        <h1>{this.state.betagigs_completed.length}</h1>
                                    </Col>
                                </Row>

                                {/* title */}
                                <Row>
                                    <Col xs={12}>
                                        <h3>Completed Betagigs</h3>
                                    </Col>
                                </Row>

                                {/* button */}
                                <Row>
                                    <Col xs={12}>
                                        <a href="/my-jobs/3" className="btn btn-bg-orange btn-fat">Details</a>
                                    </Col>
                                </Row>

                            </Grid>
                        </div>
                    </ShadowBox>
                </Row>

            </div>
        )
    }
}

CandidateDashboard.propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    userProfile: PropTypes.object.isRequired,
    // companyAdminProfile: PropTypes.object.isRequired,
    betagigs: PropTypes.array.isRequired,
    betagigs_upcoming: PropTypes.array.isRequired,
    betagigs_pending: PropTypes.array.isRequired,
    betagigs_completed: PropTypes.array.isRequired,
    betagigs_screeningScheduled: PropTypes.array.isRequired,
    betagigs_applied: PropTypes.array.isRequired
};

export default CandidateDashboard;
