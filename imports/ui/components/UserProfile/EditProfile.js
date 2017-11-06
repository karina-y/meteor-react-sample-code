import React from 'react';
import PropTypes from 'prop-types';
import { Row,
    Col,
    Button,
    Grid }
    from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SideNavBar from '../Shared/SideNavBar';
import Profile from './UserSignup';
import '../Shared/SideNavBar.less';
import UserEnums from '../../../api/Users/enums';
import WhiteBoxBody from "../Shared/Wrappers/WhiteBoxBody";

const userRoles = UserEnums.USER_ROLE_ENUM;

//todo-ky enums
const EDIT_PROFILE_VIEWS_ENUM = {
    'none': 0,
    'profile': 1,
    'referFriend': 2,
    'contactAdvocate': 3
};

class EditProfile extends React.Component {
    constructor(props) {
        super();
        this.updateMainBodyContent = this.updateMainBodyContent.bind(this);

        this.state = {
            activeProfileView: "",
            activeProfileViewComponent: "",
            activeProfileViewHeader: "",
            containingClass: ""
        }
    }

    componentWillMount(){
        //set the state's default values before component mounts:
        this.setState({
            activeProfileView: EDIT_PROFILE_VIEWS_ENUM.profile,
            activeProfileViewComponent: <Profile userRole={this.props.userRole}
                                                 userProfile={this.props.userProfile}
                                                 companyObj={this.props.userProfile}
                                                 candidateObj={this.props.userProfile}
                                                 employeeObj={this.props.companyAdminProfile}
                                                 careerArray={this.props.careerArray}
                                                 isOnSignupView={false}/>,
            activeProfileViewHeader: "My Profile"
        });
    }

    componentDidMount() {
        $('.stepzilla-tabs').find('ol.progtrckr').addClass('col-md-10 col-md-push-1');
    }


    updateMainBodyContent(e, num) {
        e.preventDefault();
        let activeProfileViewHeader;
        let activeProfileViewComponent;

        //if candidate do this one
        if (this.props.userRole === userRoles.candidate) {
            switch(num) {
                case EDIT_PROFILE_VIEWS_ENUM.profile:
                    activeProfileViewHeader = "My Profile";
                    activeProfileViewComponent = <Profile
                        userRole={this.props.userRole}
                        candidateObj={this.props.userProfile}
                        careerArray={this.props.careerArray}
                        isOnSignupView={false}
                    />;
                    break;
                case EDIT_PROFILE_VIEWS_ENUM.referFriend:
                    activeProfileViewHeader = "Refer a Friend ($$$)";
                    activeProfileViewComponent = null; //TODO - insert 'referafriend' component here
                    break;
                case EDIT_PROFILE_VIEWS_ENUM.contactAdvocate:
                    activeProfileViewHeader = "Contact Advocate";
                    activeProfileViewComponent = null; //TODO - insert 'contactAdvocate' component here
                    break;
            }
        }


        //else if company do another switch case
        //be sure to change candidateobj to companyobj for this case
        //take into account usersignup looks for userrole company not companyadmin (userRole={userRoles.company} )
        //once you're in each child component, check for isonsignupview (make sure that's getting passed down from here to usersignup to the child component)
        //and adjust accordingly
        else if (this.props.userRole === userRoles.company) {
            switch(num) {
                case EDIT_PROFILE_VIEWS_ENUM.profile:
                    activeProfileViewHeader = "My Profile";
                    activeProfileViewComponent = <Profile
                        userRole={this.props.userRole}
                        companyObj={this.props.userProfile}
                        employeeObj={this.props.companyAdminProfile}
                        isOnSignupView={false}
                    />;
                    break;
				//features not yet implemented
                // case EDIT_PROFILE_VIEWS_ENUM.referFriend:
                //     activeProfileViewHeader = "Refer a Friend ($$$)";
                //     activeProfileViewComponent = null; //TODO - insert 'referafriend' component here
                //     break;
                // case EDIT_PROFILE_VIEWS_ENUM.contactAdvocate:
                //     activeProfileViewHeader = "Contact Advocate";
                //     activeProfileViewComponent = null; //TODO - insert 'contactAdvocate' component here
                //     break;
            }
        }

        //todo-else if employee do another switch case
		//feature not yet implemented

        this.setState({
            activeProfileView: num,
            activeProfileViewComponent: activeProfileViewComponent,
            activeProfileViewHeader: activeProfileViewHeader
        });
    }

    render() {

        let sideNavItemsArray;

        //if candidate do this one
        if (this.props.userRole === userRoles.candidate) {
            sideNavItemsArray = [
                <div className={(this.state.activeProfileView == EDIT_PROFILE_VIEWS_ENUM.profile) ? 'side-nav-item active': 'side-nav-item'}
                     key="editProfile">
                    <a href="#"
                       onClick={(e) => this.updateMainBodyContent(e, EDIT_PROFILE_VIEWS_ENUM.profile)} >
                        My Profile
                    </a>
                </div>,
                <div className={(this.state.activeProfileView == EDIT_PROFILE_VIEWS_ENUM.referFriend) ? 'side-nav-item active': 'side-nav-item'}
                     key="referFriend">
                    <a href="#"
                       onClick={(e) => this.updateMainBodyContent(e, EDIT_PROFILE_VIEWS_ENUM.referFriend)}>
                        Refer A Friend ($$$)
                    </a>
                </div>,
                <div className={(this.state.activeProfileView == EDIT_PROFILE_VIEWS_ENUM.contactAdvocate) ? 'side-nav-item active': 'side-nav-item'}
                     key="contactAdvocate">
                    <a href="#"
                       onClick={(e) => this.updateMainBodyContent(e, EDIT_PROFILE_VIEWS_ENUM.contactAdvocate)}>
                        Contact Advocate
                    </a>
                </div>
            ];
        }

        //else if company do a different one
        else if (this.props.userRole === userRoles.company) {
            sideNavItemsArray = [
                <div className={(this.state.activeProfileView == EDIT_PROFILE_VIEWS_ENUM.profile) ? 'side-nav-item active': 'side-nav-item'}
                     key="editProfile">
                    <a href="#"
                       onClick={(e) => this.updateMainBodyContent(e, EDIT_PROFILE_VIEWS_ENUM.myProfile)} >
                        My Profile
                    </a>
                </div>/*,
                <div className={(this.state.activeProfileView == EDIT_PROFILE_VIEWS_ENUM.referFriend) ? 'side-nav-item active': 'side-nav-item'}
                     key="referFriend">
                    <a href="#"
                       onClick={(e) => this.updateMainBodyContent(e, EDIT_PROFILE_VIEWS_ENUM.referFriend)}>
                        Refer A Friend ($$$)
                    </a>
                </div>,
                <div className={(this.state.activeProfileView == EDIT_PROFILE_VIEWS_ENUM.contactAdvocate) ? 'side-nav-item active': 'side-nav-item'}
                     key="contactAdvocate">
                    <a href="#"
                       onClick={(e) => this.updateMainBodyContent(e, EDIT_PROFILE_VIEWS_ENUM.contactAdvocate)}>
                        Contact Advocate
                    </a>
                </div>*/
            ];
        }

        //todo else if employee do a different one
		//feature not yet implemented

        return(
            <div>
                {this.state.activeProfileViewComponent}
            </div>
        )
    }
}


EditProfile.propTypes = {
    userRole:PropTypes.string.isRequired,
    userProfile: PropTypes.array.isRequired,
    companyAdminProfile: PropTypes.array,
    careerArray: PropTypes.array.isRequired,
    isOnSignupView: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
};

export default EditProfile;

