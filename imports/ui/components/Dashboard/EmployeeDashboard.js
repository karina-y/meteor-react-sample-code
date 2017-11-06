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

const userRoles = UserEnums.USER_ROLE_ENUM;

class EmployeeDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: props.loading,
            user: props.user,
            userType: props.userType,
            userProfile: props.userProfile,
            company: props.company,
            betagigs: props.betagigs,
            betagigs_upcoming: props.betagigs_upcoming,
            betagigs_pending: props.betagigs_pending,
            betagigs_completed: props.betagigs_completed,
            betagigs_applied: props.betagigs_applied,
            betagigs_screeningScheduled: props.betagigs_screeningScheduled
        }
    }

    render() {
        const employee = this.state.userProfile;
        const company = this.state.company;
        const user = this.state.user;

        const jobTitle = NullChecks.isNullOrEmpty(employee.details.jobTitle) ? "Employee" : employee.details.jobTitle;
        const profilePicture = NullChecks.isNullOrEmpty(employee.photos.mainProfilePhoto) ? "/images/default-user-100.png" : employee.photos.mainProfilePhoto;

        return (
            <div className="dashboard">

                {/* name */}
                <Row>
                    <Col xs={12}>
                        <h2>Welcome, <span className="first-name">{user.profile.name.first}</span>!</h2>
                    </Col>
                </Row>

                {/* title */}
                <Row>
                    <Col xs={12}>
                        <h4><span className="text-capitalize">{jobTitle}</span> at <span className="text-capitalize">{company.companyName}</span></h4>
                    </Col>
                </Row>

                {/* scheduled betagigs / scheduled screens */}
                <Row>
                    <Col sm={6}>
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
                                        Scheduled Betagigs
                                    </Col>
                                </Row>

                                {/* button */}
                                <Row>
                                    <Col xs={12}>
                                        <a href="" className="btn btn-bg-orange">Details</a>
                                    </Col>
                                </Row>

                            </Grid>
                        </div>
                    </Col>

                    <Col sm={6}>
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
                                        Scheduled Screens
                                    </Col>
                                </Row>

                                {/* button */}
                                <Row>
                                    <Col xs={12}>
                                        <a href="" className="btn btn-bg-orange">Details</a>
                                    </Col>
                                </Row>

                            </Grid>
                        </div>
                    </Col>
                </Row>

                {/* completed betagigs / new applicants */}
                <Row>
                    <Col sm={6}>
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
                                        Completed Betagigs
                                    </Col>
                                </Row>

                                {/* button */}
                                <Row>
                                    <Col xs={12}>
                                        <a href="" className="btn btn-bg-orange">Details</a>
                                    </Col>
                                </Row>

                            </Grid>
                        </div>
                    </Col>

                    <Col sm={6}>
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
                                        New Applicants
                                    </Col>
                                </Row>

                                {/* button */}
                                <Row>
                                    <Col xs={12}>
                                        <a href="" className="btn btn-bg-orange">Details</a>
                                    </Col>
                                </Row>

                            </Grid>
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }
}

EmployeeDashboard.propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    userProfile: PropTypes.object.isRequired,
    company: PropTypes.object.isRequired,
    betagigs: PropTypes.array.isRequired,
    betagigs_upcoming: PropTypes.array.isRequired,
    betagigs_pending: PropTypes.array.isRequired,
    betagigs_completed: PropTypes.array.isRequired,
    betagigs_screeningScheduled: PropTypes.array.isRequired,
    betagigs_applied: PropTypes.array.isRequired
};

export default EmployeeDashboard;