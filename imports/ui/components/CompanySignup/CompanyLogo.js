import React from 'react';
import { Row, Col,
    Button, FormGroup, Modal, ControlLabel }
    from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import CompanyEnums from '../../../api/Companies/enums';
import Dropzone from '../../components/Shared/Dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import ImageConversions from '../../methods/ImageConversions';
const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;

class CompanyLogo extends React.Component {
    constructor(props) {
        super(props);

        this.handleFinalSubmit = this.handleFinalSubmit.bind(this);
        this.s3UploadCallback = this.s3UploadCallback.bind(this);
        this.handleModalActions = this.handleModalActions.bind(this);
        this.cropImageAndReturnBlob = this.cropImageAndReturnBlob.bind(this);
        this.onSkipStep = this.onSkipStep.bind(this);

        this.state = {
            userId: Accounts.userId(),
            companyLogoSrc: props.companyObj.photos.companyLogo,
            croppedImgBlob: "",
            showModal: false,
            dropzoneForLogo: "",
            cropperInstance: {
                src: "",
                allOtherOptions: {
                    autoCropArea: 1,
                    minContainerWidth: 400,
                    minContainerHeight: 400,
                    minCropBoxWidth: 160,
                    minCropBoxHeight: 160,
                    viewMode: 3,
                    aspectRatio: 1 / 1,
                    guides: true,
                    modal: false, //true by default, if false, then the grid becomes white/gray instead of gray/black
                    background: false //if true, then there's the square grid background, thoughts?!
                }
            }
        }
    }

    componentDidMount(){
        //keeping track of what step the user is on (on parent component)
        this.props.updateCurrentStep(companySignupStepEnums.companyLogo.enum);
    }

    handleFinalSubmit(e) {
        e.preventDefault();

        let companyPhotos = {
           photos: {
               companyLogo: this.state.companyLogoSrc,
               mainProfilePhoto: (this.props.companyObj.photos.mainProfilePhoto) ? this.props.companyObj.photos.mainProfilePhoto : "",
               profilePhotos: (this.props.companyObj.photos.profilePhotos) ? this.props.companyObj.photos.profilePhotos : [],
           }
        }

        //saves original values to parent component
        this.props.updateCompanyAndEmployeeValues(companyPhotos, false, true);

        if (this.props.isOnSignupView) {
            this.props.jumpToStep(companySignupStepEnums.companyLogo.enum);
        }
    }

    onSkipStep(e) {
        e.preventDefault();
        this.props.updateCompanyAndEmployeeValues({}, false, true); //update parent component
        this.props.jumpToStep(companySignupStepEnums.companyLogo.enum);
    }

    handleModalActions(action) {
        if (action == "close") {
            //close modal + clears out dropzone
            this.setState({
                showModal: false
            });

            this.state.dropzoneForLogo.removeAllFiles();

        } else if (action == "save") {
            //#1 - grab cropped image (base64) and convert to blob:
            let croppedImgBlob = this.cropImageAndReturnBlob();

            //#2 - processQueue and upload to s3!
            this.setState({
                croppedImgBlob: croppedImgBlob
            }, () => {
                this.state.dropzoneForLogo.processQueue();
            });
        }
    }

    s3UploadCallback(error, result) {
        //console.log('s3callback - result:', result, 'error - oh no:', error);
        if (result) {
            this.setState({
                companyLogoSrc: result,
                showModal: false
            }, () => {Bert.alert("Successfully cropped your logo! Don't forget to save!", 'success')});
        }

        if (error) {
            Bert.alert("Yikes! Got the error:", error, 'danger');
        }
    }

    cropImageAndReturnBlob() {
        let croppedImgBase64 = this.cropper.getCroppedCanvas({width: 160, height: 160}).toDataURL();
        let blob = ImageConversions.base64ToBlob(croppedImgBase64, 'image/jpeg');
        return blob;
    }

    render() {
        const component = this;

        let dzImageMsg;
        if (this.state.companyLogoSrc && this.state.companyLogoSrc !== "") {
            dzImageMsg = "<img class='user-has-uploaded-photo' src='" + this.state.companyLogoSrc + "'/><br />To change your company logo, drop a file here <p class='small'>(Or click here to select one!)</p>";
        } else {
            //default photo:
            dzImageMsg = "<img class='user-has-not-uploaded-photo' src='/images/default-upload-cloud.svg'/><br />Drop your company logo here to upload <p class='small'>(Or click here to select one!)</p>";
        }

        const dzConfigObjForLogo = {
            //https://github.com/felixrieseberg/React-Dropzone-Component
            componentConfig:{
                postUrl: 'no-url',
                showFiletypeIcon: false
            },
            eventHandlers:{
                init: function(passedDropzone) {
                    //retrieves dropzone instance and saves it to our state so we can use it throughout our component
                    component.setState({
                        dropzoneForLogo: passedDropzone
                    });
                },
                processing: function(file) {
                    //inserting blob inside the file object so we have access to it when we upload it to s3
                    file.blob = component.state.croppedImgBlob;
                }
            },
            //http://www.dropzonejs.com/#events
            djsConfig:{
                autoProcessQueue: false,
                uploadMultiple: false,
                dictDefaultMessage: dzImageMsg,
                parallelUploads: 1,
                maxfilesexceeded: function(file) {
                    this.removeAllFiles();
                    this.addFile(file);
                },
                maxFiles: 1,
                acceptedFiles: "image/*",
                addRemoveLinks: true,
                accept: function(file, done) {
                    //read the new file the user has just uploaded
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        //prep the cropper and open the modal when the reader is ready
                        let cropperInstance = {...component.state.cropperInstance};
                        cropperInstance['src'] = e.target.result;
                        component.setState({
                            cropperInstance: cropperInstance
                        }, () => {
                            component.setState({
                                showModal: true
                            });
                        });
                    };
                    reader.readAsDataURL(file);
                    done(); //informs dropzone to accept file and continue on
                }
            }
        };

        return (
            <div>
                <Col md={10} mdPush={1} className="logos-and-images-container signup-step-container">
                    {(this.props.isOnSignupView) ?
                        <h1>Step 4: Company Logo </h1>
                        : null }

                    <form ref={form => (this.companyLogoForm = form)} onSubmit={(e) => this.handleFinalSubmit(e)}>
                        <Row>
                            {/* dropzone for logo */}
                            <Col sm={10} smPush={1}>
                                <FormGroup>
                                    {!this.props.isOnSignupView ?
                                        <ControlLabel>Current Company Logo</ControlLabel>
                                        : null
                                    }
                                    <div className="form-group">
                                        <Dropzone
                                            ref={(el) => this.dropzoneForLogo = el}
                                            dzConfigObj={dzConfigObjForLogo}
                                            s3UploadCallback={(error, result) => this.s3UploadCallback(error, result) }
                                            uploadDataType="image-uploads"
                                            metaContext={{
                                                'baseDirectory': 'company-logo/' + Meteor.userId()
                                            }}
                                        />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            {/* skip button / next button */}
                            <Col sm={12}>
                                {(this.props.isOnSignupView) ?
                                    <div className="button-container">
                                        <Col sm={6}>
                                            <div className="button-container">
                                                <Button
                                                    type="button"
                                                    className="btn-bg-dark-gray"
                                                    onClick={(e) => this.onSkipStep(e)}>
                                                    I'll Do This Later
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="button-container">
                                                <Button className="go-to-next-step-btn btn-bg-orange"
                                                        type="submit">Save</Button>
                                            </div>
                                        </Col>
                                    </div>
                                :
                                    <div className="button-container">
                                        <Button
                                            className="go-to-next-step-btn btn-bg-orange"
                                            type="submit">Save
                                        </Button>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </form>
                </Col>

                {/* Cropping modal */}
                <Modal className="company-image-cropper-modal"
                       show={ this.state.showModal }
                       onHide={ () => this.handleModalActions("close")}
                       backdrop="static"
                       keyboard={false}
                       dialogClassName="company-logo-modal-custom-class">
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="logo-cropper-container">
                            <Cropper
                                ref={(cropper)=> this.cropper = (cropper)}
                                src={this.state.cropperInstance.src}
                                style={{height: this.state.cropperInstance.allOtherOptions.minCropBoxHeight,
                                    width: this.state.cropperInstance.allOtherOptions.minCropBoxWidth}}
                                // Cropper.js options
                                {...this.state.cropperInstance.allOtherOptions}
                            />
                        </div>
                        <div className="modal-exit-reminder">
                            <em>
                                <i className="fa fa-commenting-o" aria-hidden="true"></i>
                                <b> Heads up: </b> Exiting out of this cropping modal
                                <br/> will clear out your photo selection!
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

CompanyLogo.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
}
export default CompanyLogo;
