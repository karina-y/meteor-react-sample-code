/*
created by: karina
created date: 10/4/17
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Grid,
    Image
} from 'react-bootstrap';
import '../Shared/SideNavBar.less';
import Slider from 'react-slick';
import HostgigCard from '../Shared/HostgigCard';
import FormatHelpers from '../../methods/FormatHelpers';
import NullChecks from '../../methods/NullChecks'
import Dropzone from '../Shared/Dropzone';
import './PublicProfile.less';

class CompanyPublicProfile extends React.Component {
    constructor(props) {
        super();
        this.s3UploadCallback = this.s3UploadCallback.bind(this);

        this.state = {
            userRole: props.userRole,
            userProfile: props.userProfile,
            companyAdminProfile: props.companyAdminProfile,
            hostgigs: props.hostgigs,
            isOnSignupView: props.isOnSignupView,
            viewingOwnProfile: props.viewingOwnProfile
        }
    }

    s3UploadCallback(error, result) {
        console.log(result, error, "s3 - RESULT THEN ERROR");
        if (result) {
            //#1 - save photo to company object
            let companyObj = !NullChecks.isNullOrEmptyArray(this.state.userProfile) ? this.state.userProfile[0] : this.state.userProfile;
            companyObj.photos.mainProfilePhoto = result;
            //console.log('about to send over companyObj', companyObj);
            let companyUpdateResult = Meteor.call('companies.update', companyObj);

            //#2 - update state so it has the uploaded photo + trigger component update + display imagen
            this.setState({userProfile: companyObj}, ()=>{
                //console.log('fjdlfjsld', this.state.userProfile.photos)
                Bert.alert('File uploaded!', 'success');
            });

        } else {
            Bert.alert('Error uploading: ' + error, 'danger');
        }
    }

    render() {
        const company = !NullChecks.isNullOrEmptyArray(this.state.userProfile) ? this.state.userProfile[0] : this.state.userProfile;
        const mainProfilePhoto = NullChecks.isNullOrEmpty(company.photos.mainProfilePhoto) ? "http://via.placeholder.com/600x250" : company.photos.mainProfilePhoto;
        const website = "http://" + company.website;
        const culture = NullChecks.isNullOrEmpty(company.details.culture) ? "Looks like this company has no culture, why not apply and give them some?" : company.details.culture;
        const benefits = NullChecks.isNullOrEmpty(company.details.benefits) ?"Just because this company has nothing to show here doesn't mean they don't have any perks or benefits! Hopefully...." : company.details.benefits;
        const photos = (company.photos.profilePhotos) ? company.photos.profilePhotos : [];
        const hostgigs = _.where(this.state.hostgigs, {isActive: true});
        const viewingOwnProfile = this.state.viewingOwnProfile;
        let hostgigsComponent;
        let galleryComponent;
        let addressState = FormatHelpers.stateNameConverter(company.address.state, 'abbr');

        if (addressState == null) {
            addressState = company.address.state;
        }

        let carouselSettings = {
            dots: hostgigs.length > 3 ? true : false,
            infinite: false,
            initialSlide: 0,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            accessibility: true,
            arrows: hostgigs.length > 3 ? true : false,
            responsive: [
                {
                    breakpoint: 700,
                    settings: {
                        dots: hostgigs.length >= 1 ? true : false,
                        slidesToScroll: 1,
                        slidesToShow: 1,
                        arrows: hostgigs.length >= 1 ? true : false
                    }
                },
                {
                    breakpoint: 1380,
                    settings: {
                        dots: hostgigs.length >= 2 ? true : false,
                        initialSlide: 2,
                        slidesToScroll: 2,
                        slidesToShow: 2,
                        arrows: hostgigs.length >= 2 ? true : false
                    }
                },
                {
                    breakpoint: 1750,
                    settings: {
                        dots: hostgigs.length > 3 ? true : false,
                        infinite: false,
                        slidesToScroll: 3,
                        slidesToShow: 3,
                        arrows: hostgigs.length > 3 ? true : false
                    }
                }
            ]
        };

        const galleryCarouselSettings = {
            dots: true,
            infinite: false,
            initialSlide: 0,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            accessibility: true,
            arrows: true,
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        dots: true,
                        infinite: true,
                        slidesToScroll: 3,
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        initialSlide: 2,
                        slidesToScroll: 2,
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToScroll: 1,
                        slidesToShow: 1
                    }
                }

            ]
        };

        let dzDefaultPlaceholder = "<div class='dz-msg-container'><i class=\"fa fa-picture-o fa-3x\" aria-hidden=\"true\"></i><br/><br/> Add an image to showcase your team and work environment to potential candidates! <br/> <br/> <p class='small'>(Drop your image here or click here to select one!)</p></div>";

        if (mainProfilePhoto) {
            dzDefaultPlaceholder = "<Image responsive src='" + mainProfilePhoto + "' className=\"company-main-profile-photo\" title='Click here to select another image' />";
        }

        // const dzConfigObj = {
        //     //https://github.com/felixrieseberg/React-Dropzone-Component
        //     componentConfig:{
        //         postUrl: 'no-url',
        //         showFiletypeIcon: false
        //     },
        //     eventHandlers:{
        //         "success": function(file) {
        //             //this.removeAllFiles();
        //         },
        //     },
        //     //http://www.dropzonejs.com/#events
        //     djsConfig:{
        //         autoProcessQueue: true,
        //         uploadMultiple: false,
        //         dictDefaultMessage: dzDefaultPlaceholder,
        //         maxfilesexceeded: function(file) {
        //             this.removeAllFiles();
        //             this.addFile(file);
        //         },
        //         parallelUploads: 1,
        //         maxFiles: 1,
        //         acceptedFiles: "image/*"
        //         //addRemoveLinks: true
        //     }
        // };

        return(
            <div className="company-public-profile-container">
                {/* company logo / company quick info */}
                <Row className="vertical-center-outer-block-md">
                    <Col md={6} className="vertical-center-inner-block-md">
                        {/*<div className="upload-main-profile-photo-container">*/}
                            {/*<Dropzone*/}
                            {/*dzConfigObj={dzConfigObj}*/}
                            {/*s3UploadCallback={this.s3UploadCallback}*/}
                            {/*uploadDataType="image-uploads"*/}
                            {/*metaContext={{*/}
                            {/*'baseDirectory': 'company-profile-images/' + company._id*/}
                            {/*}}*/}
                            {/*/>*/}
                        {/*</div>*/}
                        <Image responsive src={mainProfilePhoto} className="company-cover-photo" />
                    </Col>

                    <Col md={6} className="vertical-center-inner-block-md detail-quick-info">
                        <Grid fluid>

                            <Row className="no-margin">
                                <Col xs={12}>
                                    <span className="quick-info-label">Company Name:</span> {company.companyName}
                                </Col>
                            </Row>

                            <Row className="no-margin">
                                <Col xs={12}>
                                    <span className="quick-info-label">Company Size:</span> {company.details.companySize}
                                </Col>
                            </Row>

                            <Row className="no-margin">
                                <Col xs={12}>
                                    <span className="quick-info-label">Location:</span> <span className="text-capitalize">{company.address.city}</span>, <span className="text-uppercase">{addressState}</span>
                                </Col>
                            </Row>

                            <Row className="no-margin">
                                <Col xs={12}>
                                    <span className="quick-info-label">Website:</span> <a href={website}>{company.website}</a>
                                </Col>
                            </Row>

                            {
                                viewingOwnProfile ?
                                    <Row className="text-center">
                                        <Col xs={12}>
                                            <a className="edit-profile-link btn btn-bg-orange text-uppercase" href="/edit-profile">Edit Profile</a>
                                        </Col>
                                    </Row>
                                    :
                                    ''
                            }

                        </Grid>
                    </Col>
                </Row>

                {/* company description */}
                <Row className="no-margin-top-bottom show-xs show-sm hidden-md hidden-lg">
                    <Col xs={12}>
                        <h3>About Us</h3>
                    </Col>
                </Row>

                <Row className="no-margin-top-bottom show-xs show-sm hidden-md hidden-lg">
                    <Col xs={12}>
                        {company.details.description}
                    </Col>
                </Row>

                <Row className="hidden-xs hidden-sm show-md show-lg description-container">
                    <Col xs={12}>
                        {company.details.description}
                    </Col>
                </Row>

                {/* company culture */}
                <Row className="no-margin-bottom">
                    <Col xs={12}>
                        <h3>Company Culture</h3>
                    </Col>
                </Row>

                <Row className="no-margin-top-bottom">
                    <Col xs={12}>
                        {culture}
                    </Col>
                </Row>

                {/* perks and benefits */}
                <Row className="no-margin-bottom">
                    <Col xs={12}>
                        <h3>Perks and Benefits</h3>
                    </Col>
                </Row>

                <Row className="no-margin-top-bottom">
                    <Col xs={12}>
                        {benefits}
                    </Col>
                </Row>

                {/* either only show conditionally or have some no images found kind of message, i think mike did something like this, ask him */}
                {/* gallery */}
                <Row className="no-margin-bottom">
                    <Col xs={12}>
                        <h3>Photos</h3>
                    </Col>
                </Row>

                <Row className="no-margin-top-bottom">
                    <Col xs={12}>
                        {NullChecks.isNullOrEmptyArray(photos) ?
                            "Uh oh, this company hasn't uploaded any photos! We're pretty sure they're legit though, just ask Google!"
                            :
                            <Slider {...galleryCarouselSettings}>
                                {photos.map((photo, index) => (
                                    <div data-index={index} key={index}>
                                        <img src={photo} key={index} />
                                    </div>
                                ))}
                            </Slider>
                        }
                    </Col>
                </Row>

                {/* jobs */}
                <Row className="no-margin-bottom">
                    <Col xs={12}>
                        <h3>Open Jobs</h3>
                    </Col>
                </Row>

                <Row className="no-margin-top">
                    <Col xs={12}>
                        {NullChecks.isNullOrEmptyArray(hostgigs) ?
                            "Hmmm, looks like this company doesn't have any open positions..."
                            :
                            <Slider {...carouselSettings}>
                                {hostgigs.map((hostgig, index) => (
                                    <div data-index={index} key={index}>
                                        <HostgigCard
                                            singleHostgig={hostgig}
                                            viewingCandidate={false}
                                            data-index={index}
                                            key={index}
                                            userRole={this.props.userRole} />
                                    </div>
                                ))}

                            </Slider>
                        }
                    </Col>
                </Row>

            </div>
        )
    }
}


CompanyPublicProfile.propTypes = {
    userRole:PropTypes.string.isRequired,
    userProfile: PropTypes.object.isRequired,
    companyAdminProfile: PropTypes.object,
    hostgigs: PropTypes.array,
    isOnSignupView: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
    viewingOwnProfile: PropTypes.bool.isRequired
};

export default CompanyPublicProfile;
