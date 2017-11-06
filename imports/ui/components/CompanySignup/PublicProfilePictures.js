import React from 'react';
import { Row, Col,
    Button, FormGroup,
    Modal, Alert,ControlLabel }
    from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import CompanyEnums from '../../../api/Companies/enums';
import Dropzone from '../../components/Shared/Dropzone';
import Cropper from 'react-cropper';
import Slider from 'react-slick';
import 'cropperjs/dist/cropper.css';
import ImageConversions from '../../methods/ImageConversions';
const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;

class PicturesForPublicProfile extends React.Component {
    constructor(props) {
        super(props);

        this.handleFinalSubmit = this.handleFinalSubmit.bind(this);
        this.s3UploadCallback = this.s3UploadCallback.bind(this);
        this.handleModalActions = this.handleModalActions.bind(this);
        this.cropImageAndReturnBlob = this.cropImageAndReturnBlob.bind(this);

        this.state = {
            userId: Accounts.userId(),
            originalPhotosArray: [], //images selected to be populated inside cropping modal
            croppedProfilePhotos: (props.companyObj.photos.profilePhotos) ? props.companyObj.photos.profilePhotos : [], //what we're sending to db
            currentPhotoBlob: "",
            currentCropperEl: "",
            mainProfilePhoto: (props.companyObj.photos.mainProfilePhoto) ? props.companyObj.photos.mainProfilePhoto : "",
            showModal: false,
            dropzoneEl: "",
            cropperInstance: {},
        }
    }

    componentWillMount() {
        let component = this;
        let cropperInstance = {
            src: (component.originalPhotosArray && component.originalPhotosArray.length > 0) ? component.originalPhotosArray[0] : "",
            allOtherOptions: {
                autoCropArea: 1,
                minContainerWidth: 400,
                minContainerHeight: 225,
                minCropBoxWidth: 400,
                minCropBoxHeight: 225,
                viewMode: 0,
                aspectRatio: 16 / 9,
                guides: true,
                modal: false, //true by default, if false, then the grid becomes white/gray instead of gray/black
                background: false, //if true, then there's the square grid background, thoughts?!
                ready: function() {
                    //sets the first cropper instance
                    component.setState({
                        currentCropperEl: component.cropper_0
                    });
                }
            }
        }

        this.setState({
            cropperInstance: cropperInstance
        });
    }

    componentDidMount(){
        //keeping track of what step the user is on (on parent component)
        this.props.updateCurrentStep(companySignupStepEnums.photosInfo.enum);
    }

    handleFinalSubmit(e) {
        e.preventDefault();

        let companyPhotos = {
            photos: {
                profilePhotos: this.state.croppedProfilePhotos,
                mainProfilePhoto: this.state.croppedProfilePhotos[0],
                companyLogo: this.props.companyObj.photos.companyLogo
            }
        }

        //saves original values to parent component
        this.props.updateCompanyAndEmployeeValues(companyPhotos, true, true);

        if (this.props.isOnSignupView) {
            this.props.jumpToStep(companySignupStepEnums.photosInfo.enum);
        }
    }

    handleModalActions(action) {
        if (action == "close") {
            //close modal + clears out dropzone
            this.setState({
                showModal: false
            });

            //user did not finish cropping all their files and decided to exit out
            if (this.state.originalPhotosArray.length !== this.state.dropzoneEl.getAcceptedFiles().length) {
                this.state.dropzoneEl.removeAllFiles();

                //reset values:
                let croppedProfilePhotos = (this.props.companyObj.photos.profilePhotos && this.props.companyObj.photos.profilePhotos.length > 0) ? this.props.companyObj.photos.profilePhotos: [];

                this.setState({
                    croppedProfilePhotos: croppedProfilePhotos,
                    originalPhotosArray: [],
                    currentPhotoBlob: "",
                    currentCropperEl: "",
                    mainProfilePhoto: "",
                    dropzoneEl: "",
                    cropperInstance: {}
                });
            }
        } else if (action == "save") {
            //#1 - grab cropped image (base64) and convert to blob:
            let croppedImgBlob = this.cropImageAndReturnBlob();

            //#2 - processQueue and upload to s3!
            this.setState({
                currentPhotoBlob: croppedImgBlob
            }, () => {
                this.state.dropzoneEl.processQueue();
            });
        }
    }

    s3UploadCallback(error, result) {
        const component = this;
        //console.log('s3callback - result:', result, 'error - oh no:', error);
        if (result) {
            let currentProfilePictureArray = this.state.croppedProfilePhotos;
            currentProfilePictureArray.push(result);

            let shouldCloseModalCb = function() {
                let i = 0;
                let numOfDisabledCroppers = 0;
                _.each(component.state.originalPhotosArray, function(p) {
                    let cropper = component['cropper_' + i];
                    let isDisabled = cropper.cropper.disabled;
                    if (isDisabled) {
                        numOfDisabledCroppers +=1;
                    }
                    i+=1;
                });

                if (component.state.originalPhotosArray.length === numOfDisabledCroppers) {
                    //close modal and reset values:
                    component.setState({
                        showModal: false, //only set to false when user cropped all photos they've selected
                        originalPhotosArray: [],
                        currentPhotoBlob: "",
                        currentCropperEl: ""
                    });
                }
            }

            this.setState({
                croppedProfilePhotos: currentProfilePictureArray
                } , () => {
                Bert.alert("Successfully cropped!", 'success');
                component.state.currentCropperEl.disable();   //disable the current cropper - already got the cropped photo
                component.slider.slickNext();   //takes user to the next image
                shouldCloseModalCb();
            });
        }

        if (error) {
            Bert.alert("Yikes! Got the error:", error, 'danger');
        }
    }

    cropImageAndReturnBlob() {
        let croppedImgBase64 = this.state.currentCropperEl.getCroppedCanvas({width: 400, height: 225}).toDataURL();
        let blob = ImageConversions.base64ToBlob(croppedImgBase64, 'image/jpeg');
        return blob;
    }

    render() {
        const component = this;
        let dzImageMsg = "<img class='user-has-not-uploaded-photo' src='/images/default-picture.svg'/><br />Drop your images here to upload <p class='small'>(Or click here to select them!)</p>";

        const dropzoneForPublicPictures = {
            //https://github.com/felixrieseberg/React-Dropzone-Component
            componentConfig:{
                postUrl: 'no-url',
                showFiletypeIcon: false
            },
            eventHandlers:{
                init: function(passedDropzone) {
                    //retrieves dropzone instance and saves it to our state so we can use it throughout our component
                    component.setState({
                        dropzoneEl: passedDropzone
                    });
                },
                processing: function(file) {
                    //inserting blob inside the file object so we have access to it when we upload it to s3
                    file.blob = component.state.currentPhotoBlob;
                }
            },
            //http://www.dropzonejs.com/#events
            djsConfig:{
                autoProcessQueue: false,
                uploadMultiple: true,
                dictDefaultMessage: dzImageMsg,
                parallelUploads: 1,
                maxFilesize: 100, //mb
                acceptedFiles: "image/*",
                accept: function(file, done) {
                    //read the new file the user has just uploaded
                    let reader = new FileReader();
                    let listOfAllFiles = this.files;
                    let listOfQueuedFiles = _.filter(listOfAllFiles, function(item) {
                        if (item.status == "queued" || item.status == "added") {
                            return item;
                        } else {
                            return;
                        }
                    });
                    reader.onload = (e) => {
                        //prep the cropper and open the modal when the reader is ready
                        let originalPhotosArray = component.state.originalPhotosArray;
                        originalPhotosArray.push(e.target.result);
                        component.setState({
                            originalPhotosArray: originalPhotosArray
                        }, () => {
                            //to calculate the right time to open up the modal
                            let totalNumOfFiles = component.state.croppedProfilePhotos.length + component.state.originalPhotosArray.length;
                            if (totalNumOfFiles === listOfAllFiles.length || listOfAllFiles.length === component.state.originalPhotosArray.length || listOfQueuedFiles.length === component.state.originalPhotosArray.length) {
                                component.setState({
                                    showModal: true
                                });
                            }
                        });
                    }
                    reader.readAsDataURL(file);
                    done();

                }
            }
        };
        const cropCarouselSettings = {
            dots: true,
            infinite: false,
            initialSlide: 0,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            accessibility: true,
            arrows: true,
            className: 'single-crop-slide',
            beforeChange: function(oldIndex, newIndex) {
              let nextCropperRef = component['cropper_' + newIndex];
              let currentCropperInstance = {...component.state.cropperInstance};
              currentCropperInstance.src = component.state.originalPhotosArray[newIndex];
              component.setState({
                  currentCropperEl: nextCropperRef,
                  cropperInstance: currentCropperInstance
              });
            }
        };
        const galleryCarouselSettings = {
            dots: true,
            infinite: false,
            initialSlide: 0,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            accessibility: true,
            arrows: true,
            className: 'single-crop-slide',
            beforeChange: function(oldIndex, newIndex) {
                let nextCropperRef = component['cropper_' + newIndex];
                let currentCropperInstance = {...component.state.cropperInstance};
                currentCropperInstance.src = component.state.originalPhotosArray[newIndex];
                component.setState({
                    currentCropperEl: nextCropperRef,
                    cropperInstance: currentCropperInstance
                });
            }
        };

        return (
            <div>
                <Col md={10} mdPush={1} className="logos-and-images-container signup-step-container">
                    {(this.props.isOnSignupView) ?
                        <h1>Step 5: Profile Images </h1>
                        : null }

                    <form ref={form => (this.publicProfileImageForm = form)} onSubmit={(e) => this.handleFinalSubmit(e)}>
                        {/*/!* Little message informing users, logo + images are optional, but encouraged! *!/*/}
                        {(!this.state.croppedProfilePhotos || this.state.croppedProfilePhotos.length == 0) ?
                            <Row>
                                <Col sm={12}>
                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    <span className="tip-for-company-images">
                                    While images for your public profile are completely optional, <br/>
                                    we'd recommend our company users upload just a couple.
                                    <br/>It really helps out your candidates to get to know your company a little better.
                                </span>
                                    <br/>
                                    <br/>
                                </Col>
                            </Row>
                             : null }

                        <Row>
                            {/* dropzone for public profile */}
                            <Col sm={10} smPush={1}>
                                <FormGroup>
                                    <div className="form-group">
                                        <Dropzone
                                            ref={(el) => this.dropzoneEl = el}
                                            dzConfigObj={dropzoneForPublicPictures}
                                            s3UploadCallback={(error, result) => this.s3UploadCallback(error, result) }
                                            uploadDataType="image-uploads"
                                            metaContext={{
                                                'baseDirectory': 'company-profile-images/' + Meteor.userId()
                                            }}
                                        />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>


                        { this.state.croppedProfilePhotos && this.state.croppedProfilePhotos.length > 0 ?
                            <Row>
                                {/* gallery */}
                                <Col sm={10} smPush={1}>
                                    <ControlLabel>Uploaded Images:</ControlLabel>
                                    <FormGroup>
                                        <div className="form-group">
                                            <Slider
                                                {...galleryCarouselSettings}>
                                                {this.state.croppedProfilePhotos.map((img, index) => (
                                                    <div key={index}>
                                                        <img
                                                            src={component.state.croppedProfilePhotos[index]}
                                                        />
                                                    </div>
                                                ))}
                                            </Slider>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            :
                            null}



                        <Row>
                            {/* skip button / next button */}
                            <Col sm={12}>
                                <div className="button-container">
                                    <Button className="go-to-next-step-btn btn-bg-orange" type="submit">{this.props.isOnSignupView ? "Complete Signup" : "Save"}</Button>
                                </div>
                            </Col>
                        </Row>
                    </form>
                </Col>

                {/* Cropping modal */}
                <Modal className="company-image-cropper-modal"
                       show={ this.state.showModal }
                       onHide={ () => this.handleModalActions("close")}
                       backdrop="static"
                       keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="public-profile-img-cropper-container">
                            {(this.state.currentCropperEl && this.state.currentCropperEl.cropper.disabled) ?
                                <Alert bsStyle="warning">
                                     You have already cropped and save this image!
                                </Alert>
                                : null
                            }

                            <Slider
                                ref={(el) => this.slider = (el)}
                                {...cropCarouselSettings}>
                                {this.state.originalPhotosArray.map((img, index) => (
                                    <div key={index}>
                                        <Cropper
                                            ref={(cropper)=> this['cropper_' + index] = (cropper)}
                                            src={component.state.originalPhotosArray[index]}
                                            style={{height: component.state.cropperInstance.allOtherOptions.minContainerHeight,
                                                width: component.state.cropperInstance.allOtherOptions.minContainerWidth}}
                                            // Cropper.js options
                                            {...component.state.cropperInstance.allOtherOptions}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <div className="modal-exit-reminder">
                            <em>
                                <i className="fa fa-commenting-o" aria-hidden="true"></i>
                                <b> Heads up: </b> Closing out of this cropping modal
                                <br/> will result in losing all your progress!
                            </em>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-bg-purple btn-md" onClick={ () => this.handleModalActions("save") }>CROP</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

PicturesForPublicProfile.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
}

export default PicturesForPublicProfile;
