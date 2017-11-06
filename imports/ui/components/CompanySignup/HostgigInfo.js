import React from 'react';
import { Row,
    Col,
    Button,
    FormGroup,
    ControlLabel }
    from 'react-bootstrap';
import moment from 'moment-timezone';
import Geosuggest from 'react-geosuggest';
import FormControl from 'react-bootstrap/lib/FormControl';
import SwitchButton from 'lyef-switch-button';
import PropTypes from 'prop-types';

import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base';
import validate from '../../../modules/validate';
import {Typeahead} from 'react-bootstrap-typeahead';
import {formatPhoneNumber, unformatPhoneNumber} from '../../methods/FormFieldsUiHelpers';
import { getSkillsArray } from '../Shared/Signup/DropdownData/Skills';
import EnumConversionHelpers from '../../methods/EnumConversionHelpers';
import IdConversionHelpers from '../../methods/IdConversionHelpers';
import NullChecks from '../../methods/NullChecks';
import SharedEnums from '../../../api/Shared/enums';
import CompanyEnums from '../../../api/Companies/enums';

const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;
const experienceLevelEnums = SharedEnums.EXPERIENCE_LEVEL_ENUM;
const educationLevelEnums = SharedEnums.EDUCATION_LEVEL_ENUM;

class HostgigInfo extends React.Component {
    constructor(props) {
        super(props);

        this.saveHostgigInfo = this.saveHostgigInfo.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleGmapsAutoCompleteInput = this.handleGmapsAutoCompleteInput.bind(this);
        this.validateHostgigInfo = this.validateHostgigInfo.bind(this);
        this.updateHostgig = this.updateHostgig.bind(this);
        this.onSkipStep = this.onSkipStep.bind(this);
        this.setStateVariables = this.setStateVariables.bind(this);

        this.state = {
            userId: Accounts.userId(),
            jobTitle: props.hostgigObj.jobTitle,
            careerId: props.hostgigObj.careerId,
            careerCategoryId: props.hostgigObj.careerCategoryId,
            address: props.companyObj.address,
            minSalary: props.hostgigObj.minSalary,
            maxSalary: props.hostgigObj.maxSalary,
            gigDetails: props.hostgigObj.gigDetails,
            skillsNeeded: props.hostgigObj.skillsNeeded,
            experienceLevel: props.hostgigObj.experienceLevel,
            experienceLevelPreferred: props.hostgigObj.experienceLevelPreferred,
            educationLevel: props.hostgigObj.educationLevel,
            educationLevelPreferred: props.hostgigObj.educationLevelPreferred,
            visaSponsorshipAvailable: props.hostgigObj.visaSponsorshipAvailable,
            gigExpirationDate: props.hostgigObj.gigExpirationDate,
            isFormValidatedAndSaved: false,
        }
    }

    componentDidMount(){
        //keeping track of what step the user is on (on parent component)
        this.props.updateCurrentStep(companySignupStepEnums.hostgigInfo.enum);
    }

    componentWillMount(){
        this.setStateVariables(this.props);
    }


    setStateVariables(props) {
        //typeahead always expects an array, even for single-selects
        let experienceLevel = [];
        let educationLevel = [];
        let careerId = [];
        let careerCategoryId = [];

        const currentExperienceLevel = props.hostgigObj.experienceLevel;
        const currentEducationLevel = props.hostgigObj.experienceLevel;
        const currentCareerId = props.hostgigObj.careerId;
        const currentCareerCategoryId = props.hostgigObj.careerCategoryId;


        if (!NullChecks.isNullOrEmptyArray(currentExperienceLevel)) {
            if (isNaN(currentExperienceLevel[0])) {
                //not setting to array because it's already an array
                experienceLevel = currentExperienceLevel;
            }

            else {
                //convert enum to display name
                const convertedStatus = EnumConversionHelpers.enumToDisplayName(experienceLevelEnums, currentExperienceLevel[0]);

                if (convertedStatus.error) {
                    //todo-ky error
                    Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
                }
                else {
                    experienceLevel = [convertedStatus.value];
                }
            }
        }

        if (!NullChecks.isNullOrEmptyArray(currentEducationLevel)) {
            if (isNaN(currentEducationLevel[0])) {
                //not setting to array because it's already an array
                educationLevel = currentEducationLevel;
            }

            else {
                //convert enum to display name
                const convertedStatus = EnumConversionHelpers.enumToDisplayName(educationLevelEnums, currentEducationLevel[0]);

                if (convertedStatus.error) {
                    //todo-ky error
                    Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
                }
                else {
                    educationLevel = [convertedStatus.value];
                }
            }
        }

        if (!NullChecks.isNullOrEmptyArray(currentCareerId)) {
            if (isNaN(currentCareerId[0])) {
                //not setting to array because it's already an array
                careerId = currentCareerId;
            }

            else {
                //convert id to title
                const convertedCareerId = IdConversionHelpers.careerIdToTitle(currentCareerId[0]);

                if (convertedCareerId.error) {
                    //todo-ky error
                    Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
                }
                else {
                    careerId = [convertedCareerId.value];
                }
            }
        }

        this.setState({
            ['experienceLevel']: experienceLevel,
            ['educationLevel']: educationLevel,
            ['careerId']: careerId
        });

    }

    validateHostgigInfo(e) {
        if (e) {
            e.preventDefault();
        }

        let validationResult = validate($(this.hostgigInfoForm), {
            rules: {
                jobTitle: {
                    required: true
                },
                careerCategory: {
                    required: true
                },
                address: {
                    required: true
                },
                minSalary: {
                    required: true,
                    maxlength: 11 //highest salary can be in the million range
                },
                maxSalary: {
                    required: true,
                    maxlength: 11 //highest salary can be in the million range
                },
                gigDetails: {
                    required: true
                },
                skillsNeeded: {
                    matchArrayLength: 2 //means value is required - no need to set a 'required' prop
                },
                experienceLevel: {
                    required: true
                },
                experienceLevelPreferred: {
                    required: false
                },
                educationLevel: {
                    required: true
                },
                educationLevelPreferred: {
                    required: false
                },
                visaSponsorshipAvailable: {
                    required: false
                },
                gigExpirationDate: {
                    required: false
                }
            },
            messages: {
                jobTitle: {
                    required: "Please provide the position title you are advertising.",
                    accept: "[a-zA-Z ]+"
                },
                careerCategory: {
                    required: "What type of role is this position?"
                },
                address: {
                    required: "Please provide a location."
                },
                minSalary: {
                    required: "Please provide the minimum salary offered.",
                    maxlength: 11 //highest salary can be in the million range
                },
                maxSalary: {
                    required: "Please provide the maximum salary offered.",
                    maxlength: 11 //highest salary can be in the million range
                },
                gigDetails: {
                    required: "Please provide a description of this position."
                },
                skillsNeeded: {
                    matchArrayLength: "Please provide at least 2 skills necessary for this position."
                },
                experienceLevel: {
                    required: "Please provide the experience level required for this position."
                },
                educationLevel: {
                    required: "Please provide the education level required for this position."
                },
                gigExpirationDate: {
                    required: "Please provide the expiration date for this position."
                }
            }
        });

        this.saveHostgigInfo(validationResult);
    }

    //function isValidated() is called when a user clicks on the top step nav (Basic Info, Hostgig Info, etc.)
    //this is how Stepzilla prevents users from moving to a different step before finishing their current step
    //*make sure each stepzilla component has this function
    isValidated() {
        let isStepValid = this.state.isFormValidatedAndSaved;
        if (isStepValid == false) {
            this.validateHostgigInfo();
        }
        return isStepValid;
    }

    saveHostgigInfo(validator) {
        if (validator && validator.form() === true) {

            if (this.state.experienceLevel == null || this.state.experienceLevel.length == 0) {
                Bert.alert("Please select experience level from the dropdown!", 'danger');
            }

            else if (this.state.educationLevel == null || this.state.educationLevel.length == 0) {
                Bert.alert("Please select education level from the dropdown!", 'danger');
            }

            else if (this.state.skillsNeeded == null || this.state.skillsNeeded.length == 0) {
                Bert.alert("Please select at least 2 skills from the dropdown!", 'danger');
            }

            else if (this.state.careerId == null || this.state.careerId.length == 0) {
                Bert.alert("Please select career category from the dropdown!", 'danger');
            }

            else {
                const updatedHostgigObj = {
                    jobTitle: this.state.jobTitle,
                    address: this.state.address,
                    careerId: this.state.careerId,
                    careerCategoryId: this.state.careerCategoryId,
                    minSalary: this.state.minSalary,
                    maxSalary: this.state.maxSalary,
                    gigDetails: this.state.gigDetails,
                    skillsNeeded: this.state.skillsNeeded,
                    experienceLevel: this.state.experienceLevel,
                    experienceLevelPreferred: this.state.experienceLevelPreferred,
                    educationLevel: this.state.educationLevel,
                    educationLevelPreferred: this.state.educationLevelPreferred,
                    visaSponsorshipAvailable: this.state.visaSponsorshipAvailable,
                    gigExpirationDate: this.state.gigExpirationDate
                };

                this.updateHostgig(updatedHostgigObj);
            }

        }
        else {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
    }

    updateHostgig(hostgigObj) {
        if (this.state.address.city == null || this.state.address.city == "" ||
            this.state.address.state == null || this.state.address.state == "") {
            Bert.alert("Please enter the location of this position", 'danger');
        }
        else {
            //saves original values to parent component
            this.props.updateCompanyAndEmployeeValues(hostgigObj, false, true);

            this.setState({isFormValidatedAndSaved: true});
            this.props.jumpToStep(companySignupStepEnums.hostgigInfo.enum);
        }
    }

    handleInputChange(event, nameOfSelect) {

        let nameOfActiveField = nameOfSelect;
        let valOfField;

        if (!nameOfSelect) {

            if (event.target.type === "checkbox") {
                nameOfActiveField = event.target.id;

                if (event.target.id && event.target.id === "experienceLevelPreferred") {
                    valOfField = event.target.checked;
                }
                else if (event.target.id && event.target.id === "educationLevelPreferred") {
                    valOfField = event.target.checked;
                }
                else if (event.target.id && event.target.id === "visaSponsorshipAvailable") {
                    valOfField = event.target.checked;
                }
            }
            else {
                nameOfActiveField = event.target.name;
                valOfField = event.target.value;
            }


        } else if (nameOfSelect === "skillsNeeded") {
            valOfField = event;
        }
        else if (nameOfSelect === "educationLevel") {
            nameOfActiveField = nameOfSelect;

            //doing a ternary so if they choose to clear the field we can start fresh
            valOfField = event[0] != null ? [event[0].value.toString()] : [];
        }
        else if (nameOfSelect === "experienceLevel") {
            nameOfActiveField = nameOfSelect;

            //doing a ternary so if they choose to clear the field we can start fresh
            valOfField = event[0] != null ? [event[0].value.toString()] : [];
        }
        else if (nameOfSelect === "careerId") {
            nameOfActiveField = nameOfSelect;

            //doing a ternary so if they choose to clear the field we can start fresh
            valOfField = event[0] != null ? [event[0].value.toString()] : [];

            this.setState({
                careerCategoryId: event[0] != null ? event[0].careerCategoryId.toString() : ''
            });
        }
        else {
            //this code block will deal with select elements - param 'nameOfSelect' will NOT be null
            valOfField = [event[0]];
        }

        this.setState({
            [nameOfActiveField]: valOfField
        });
    }

    handleGmapsAutoCompleteInput(selectedObj) {
        Meteor.call('utility.parseGoogleMapsAddress', selectedObj, (error, response) => {
            if (error) {
                Bert.alert(error.reason, 'danger');
            } else if (this.state.address.city == null || this.state.address.city == "" ||
                this.state.address.state == null || this.state.address.state == "") {
                Bert.alert("Please enter the location of this position", 'danger');
            } else {
                this.setState({
                    address: response
                });
            }
        });
    }

    onSkipStep(e) {
        e.preventDefault();
        this.props.updateCompanyAndEmployeeValues({}, false, false); //update parent component
        this.props.jumpToStep(companySignupStepEnums.hostgigInfo.enum);
    }

    render() {

        let minDate = moment().format('YYYY-MM-DD');
        let address = "";
        let careerCategoryArr;

        if (this.state.address.city && this.state.address.state)
        {
            address = this.state.address.city + ", " + this.state.address.state;
        }

        this.props.careerArray.map(function(career, index, array) {
            let tempObj = {
                value: career.title,
                label: career.title,
                careerCategoryId: career.categoryId
            };

            array[index] = Object.assign(array[index], tempObj);

            if ((array.length - 1) == index) {
                careerCategoryArr = array;
            }
        });

        return (
            <Col md={10} mdPush={1} className="hostgig-info-container signup-step-container">
                <h1>Step 4: Create A Job Posting</h1>
                <form ref={form => (this.hostgigInfoForm = form)} onSubmit={(e) => this.validateHostgigInfo(e)}>
                    {/* title */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Title</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. Software Engineer"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.jobTitle}
                                    name="jobTitle"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* career category */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Career Category</ControlLabel>
                                <Typeahead
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    onChange={(selectedValueOrValues) => this.handleInputChange(selectedValueOrValues, "careerId")}
                                    options={_.map(
                                        careerCategoryArr, function(item) {
                                            return {
                                                "value":item._id,
                                                "label":item.title,
                                                "careerCategoryId":item.categoryId
                                            }
                                        })}
                                    placeholder= "Type of Role"
                                    align="justify"
                                    clearButton={true}
                                    defaultSelected={this.state.careerId}
                                    inputProps={{ 'name': 'careerId', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>


                    {/* location */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Location</ControlLabel>
                                {/* Reference: https://github.com/ubilabs/react-geosuggest*/}
                                <Geosuggest
                                    // initialValue={cityAndState}
                                    inputClassName="form-control"
                                    placeholder="Ex. Los Angeles, California"
                                    onSuggestSelect={(e) => this.handleGmapsAutoCompleteInput(e)}
                                    name="address"
                                    country="us"
                                    style={{
                                        'input': {'marginTop': '-5px'},
                                        'suggests': {'border': '1px solid #d9d9d9'},
                                        'suggestItem': {'fontSize': '1.3rem'}
                                    }}
                                    initialValue={address}
                                />
                            </FormGroup>
                        </Col>
                    </Row>


                    {/* min and max salary */}
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <ControlLabel>Min Salary (Estimated)</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. 65000"
                                    value={this.state.minSalary}
                                    onChange={(e) => this.handleInputChange(e)}
                                    name="minSalary"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm={6}>
                            <FormGroup>
                                <ControlLabel>Max Salary (Estimated)</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. 65000"
                                    value={this.state.maxSalary}
                                    onChange={(e) => this.handleInputChange(e)}
                                    name="maxSalary"
                                />
                            </FormGroup>
                        </Col>
                    </Row>


                    {/* description of role */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Description of Role</ControlLabel>
                                <textarea
                                    rows="4"
                                    cols="10"
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. Will spend copious hours strung out on coffee... jk"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.gigDetails}
                                    name="gigDetails"
                                >
	                            </textarea>
                            </FormGroup>
                        </Col>
                    </Row>


                    {/* desired skills */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Desired Skills (Min of 2)</ControlLabel>
                                <Typeahead
                                    multiple
                                    clearButton={true}
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    align="justify"
                                    onChange={(selectedValueOrValues) => this.handleInputChange(selectedValueOrValues, "skillsNeeded", null)}
                                    options={_.map(getSkillsArray(),function(item){ return item })}
                                    placeholder="Ex. Ninja-like coder"
                                    defaultSelected={this.state.skillsNeeded}
                                    inputProps={{ name: 'skillsNeeded', 'data-isTypescriptSelect': true}}/>
                            </FormGroup>
                        </Col>
                    </Row>


                    {/* experience level / preferred? */}
                    <Row className="experience-level-container">
                        <Col sm={6}>
                            <ControlLabel>Experience Level</ControlLabel>
                            <Typeahead
                                clearButton={true}
                                className="bootstrap-typeahead typeahead-validation-container"
                                align="justify"
                                onChange={(e) => this.handleInputChange(e, "experienceLevel")}
                                options={_.map(
                                    experienceLevelEnums, function(item) {
                                        return {
                                            "value":item.enum,
                                            "label":item.displayName
                                        }
                                    })}
                                placeholder="Ex. 0-2 Years"
                                defaultSelected={this.state.experienceLevel}
                                inputProps={{ name: 'experienceLevel', 'data-isTypescriptSelect': true}}
                            />
                        </Col>

                        <Col sm={6} className="switch-button-container">
                            <ControlLabel></ControlLabel>
                            <SwitchButton
                                id="experienceLevelPreferred"
                                name="experienceLevelPreferred"
                                labelLeft="Preferred"
                                labelRight="Required"
                                isChecked={this.state.experienceLevelPreferred}
                                action={(e) => this.handleInputChange(e, null, null)}
                            />
                        </Col>
                    </Row>


                    {/* education level / preferred? */}
                    <Row className="education-level-container">
                        <Col sm={6}>
                            <ControlLabel>Level of Education</ControlLabel>
                            <Typeahead
                                clearButton={true}
                                className="bootstrap-typeahead typeahead-validation-container"
                                align="justify"
                                onChange={(e) => this.handleInputChange(e, "educationLevel")}
                                options={_.map(
                                    educationLevelEnums, function(item) {
                                        return {
                                            "value":item.enum,
                                            "label":item.displayName
                                        }
                                    })}
                                placeholder="Ex. Bachelor's Degree"
                                defaultSelected={this.state.educationLevel}
                                inputProps={{ name: 'educationLevel', 'data-isTypescriptSelect': true}}
                            />
                        </Col>

                        <Col sm={6} className="switch-button-container">
                            <SwitchButton
                                id="educationLevelPreferred"
                                name="educationLevelPreferred"
                                labelLeft="Preferred"
                                labelRight="Required"
                                isChecked={this.state.educationLevelPreferred}
                                action={(e) => this.handleInputChange(e, null, null)}
                            />
                        </Col>
                    </Row>


                    {/* visa sponsorship available */}
                    <Row>
                        <Col xs={12}>
                            <ControlLabel className="text-right">Visa sponsorship available for this role?</ControlLabel>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} className="text-left">
                            <SwitchButton
                                id="visaSponsorshipAvailable"
                                name="visaSponsorshipAvailable"
                                labelLeft="No"
                                labelRight="Yes"
                                isChecked={this.state.visaSponsorshipAvailable}
                                action={(e) => this.handleInputChange(e, null, null)}
                            />
                        </Col>
                    </Row>


                    {/* expiration date */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Expiration Date for This Posting</ControlLabel>
                                <input
                                    type="date"
                                    name="gigExpirationDate"
                                    min={minDate}
                                    value={this.state.gigExpirationDate}
                                    onChange={(e) => this.handleInputChange(e)}
                                    ref={gigExpirationDate => (this.gigExpirationDate = gigExpirationDate)}
                                    className="form-control"
                                />
                            </FormGroup>
                        </Col>
                    </Row>


                    {/* skip button / next button */}
                    <Row>
                        <Col sm={6}>
                            <div className="button-container">
                                <Button
                                    type="button"
                                    className="btn-bg-dark-gray btn-fat btn-wide"
                                    onClick={(e) => this.onSkipStep(e)}>
                                    I'll Do This Later
                                </Button>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="button-container">
                                <Button className="btn-bg-orange btn-fat btn-wide" type="submit">Save</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        )
    }
}

HostgigInfo.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
};

export default HostgigInfo;
