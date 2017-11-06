import React from 'react';
import { Grid,
    Row,
    Col,
    Button,
    FormGroup,
    ControlLabel }
    from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import Geosuggest from 'react-geosuggest';
import { getJobSearchStatusArray } from './DropdownData/JobSearchStatus';
import validate from '../../../modules/validate';
import  { Typeahead } from 'react-bootstrap-typeahead';
import { formatPhoneNumber, unformatPhoneNumber } from '../../methods/FormFieldsUiHelpers';
import numeral from 'numeral';
import EnumConversionHelpers from '../../methods/EnumConversionHelpers';
import SharedEnums from '../../../api/Shared/enums';
import CandidateEnums from '../../../api/Candidates/enums';

const workAuthStatusEnums = SharedEnums.WORK_AUTH_ENUM;
const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;

class PersonalInfo extends React.Component {
    constructor(props) {
        super(props);
        this.savePersonalInfo = this.savePersonalInfo.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleGmapsAutoCompleteInput = this.handleGmapsAutoCompleteInput.bind(this);
        this.validatePersonalInfo = this.validatePersonalInfo.bind(this);
        this.updateCandidate = this.updateCandidate.bind(this);
        this.setStateVariables = this.setStateVariables.bind(this);

        this.state = {
            userId: Accounts.userId(),
            address: {
                city: props.candidateObj.address.city,
                state: props.candidateObj.address.state,
                timezoneId: props.candidateObj.address.timezoneId
            },
            currentTitle: props.candidateObj.currentTitle,
            desiredSalary: props.candidateObj.desiredSalary,
            phoneNumber: props.candidateObj.phoneNumber,
            description: props.candidateObj.description,
            perfectJobDesc: props.candidateObj.perfectJobDesc,
            jobSearchStatus: props.candidateObj.jobSearchStatus,
            workAuthStatus: props.candidateObj.workAuthStatus,
            isFormValidatedAndSaved: false,
        }
    }

    componentWillMount(){
        this.setStateVariables(this.props);
    }

    componentDidMount(){
		//keeping track of what step the user is on (on parent component
        this.props.updateCurrentStep(candidateSignupStepEnums.personalInfo.enum);
    }

    setStateVariables(props) {
        //typeahead always expects an array, even for single-selects
        let workAuthStatus = [];
        const currentWorkAuthStatus = props.candidateObj.workAuthStatus;

        if (currentWorkAuthStatus && Array.isArray(currentWorkAuthStatus) && currentWorkAuthStatus.length > 0) {
            if (isNaN(currentWorkAuthStatus[0])) {
                //not setting to array because it's already an array
                workAuthStatus = currentWorkAuthStatus;
            }

            else {
                //convert enum to display name
                const convertedStatus = EnumConversionHelpers.enumToDisplayName(workAuthStatusEnums, currentWorkAuthStatus[0]);

                if (convertedStatus.error) {
                    Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
                }
                else {
                    workAuthStatus = [convertedStatus.value];
                }
            }
        }

        this.setState({
            ['workAuthStatus']: workAuthStatus
        });

    }

    validatePersonalInfo(e) {
        if (e) {
            e.preventDefault();
        }

        let validationResult = validate($(this.personalInfoForm), {
            rules: {
                address: {
                    required: true
                },
                currentTitle: {
                    required: true
                },
                desiredSalary: {
                    required: true,
                    maxlength: 11 //highest salary can be in the million range
                },
                phoneNumber: {
                    required: true,
                    validPhoneNumber: true
                },
                jobSearchStatus: {
                    required: true
                },
                workAuthStatus: {
                    required: true
                },
                description: {
                    required: true,
                    maxlength: 150
                },
                perfectJobDesc: {
                    required: true,
                    minlength: 25
                },
            },
            messages: {
                address: {
                    required: 'What city are you currently residing in?'
                },
                currentTitle: {
                    required: 'If you\'re actively in the job market, please write down "N/A"'
                },
                desiredSalary: {
                    required: 'Please provide your desired salary.'
                },
                phoneNumber: {
                    required: 'Please provide the best number to contact you.'
                },
                jobSearchStatus: {
                    required: 'Where are you in your job search?'
                },
                workAuthStatus: {
                    required: 'Please provide your current work authorization state.'
                },
                description: {
                    required: 'Please tell us a brief description about yourself.',
                    maxlength: 'This description cannot be longer than 150 characters.'
                },
                perfectJobDesc: {
                    required: 'Please tell us a little more about what you\'re looking for in your perfect job and company.',
                    minlength: 'Description must be at least 25 characters in length.'
                },
            }
        });
        this.savePersonalInfo(validationResult);
    }

    //function isValidated() is called when a user clicks on the top step nav (Basic Info, Personal Info, etc.)
    //this is how Stepzilla prevents users from moving to a different step before finishing their current step
    //*make sure each stepzilla component has this function
    isValidated() {
        if (this.props.isOnSignupView) {
            let isStepValid = this.state.isFormValidatedAndSaved;
            if (isStepValid == false) {
                this.validatePersonalInfo();
            }
            return isStepValid;
        } else {
            return true;
        }
    }

    savePersonalInfo(validator) {
        if (validator && validator.form() == true) {

            if (this.state.jobSearchStatus == null || this.state.jobSearchStatus.length == 0) {
                Bert.alert("Please select a job search status from the dropdown!", 'danger');
            }

            else if (this.state.workAuthStatus == null || this.state.workAuthStatus.length == 0) {
                Bert.alert("Please select a work authorization status from the dropdown!", 'danger');
            }

            else {
                let updatedCandidateObj = _.omit(this.state, "isFormValidatedAndSaved");
                this.updateCandidate(updatedCandidateObj);
            }

        } else {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
    }

    updateCandidate(candidateObj) {
        this.props.updateCandidateValues(candidateObj, false, true); //saves original values to parent component
        this.setState({isFormValidatedAndSaved: true});

        if (this.props.isOnSignupView) {
            this.props.jumpToStep(candidateSignupStepEnums.personalInfo.enum);
        }
    }

    handleInputChange(event, nameOfSelect) {
        let nameOfActiveField;
        let valOfField;

        if (!nameOfSelect) {
            nameOfActiveField = event.target.name;
            valOfField = event.target.value;

            if (nameOfActiveField === "phoneNumber") {
                valOfField = unformatPhoneNumber(valOfField);
            }

            if (nameOfActiveField === "desiredSalary") {
                valOfField = numeral(valOfField).value();
            }
        }
        else if (nameOfSelect === "workAuthStatus") {
            nameOfActiveField = nameOfSelect;

            //doing a ternary so if they choose to clear the field we can start fresh
            valOfField = event[0] != null ? [event[0].value.toString()] : [];
        }
        else {
            //this code block will deal with select elements - param 'nameOfSelect' will NOT be null
            nameOfActiveField = nameOfSelect;
            valOfField = event;
        }

        this.setState({
            [nameOfActiveField]: valOfField
        });
    }

    handleGmapsAutoCompleteInput(selectedObj) {
        //todo are we sure those indices will always be city and state?
        let addressObj = {
            city: (selectedObj.gmaps.address_components[0]) ? selectedObj.gmaps.address_components[0].long_name : "",
            state: (selectedObj.gmaps.address_components[2]) ? selectedObj.gmaps.address_components[2].long_name : "",
            timezoneId: null
        };

        //Find city + state:
        _.each(selectedObj.gmaps.address_components,function(address_component){
            let returnedIndexForCity = _.indexOf(address_component.types, "locality");
            let returnedIndexForState = _.indexOf(address_component.types, "administrative_area_level_1");
            if (returnedIndexForCity !== -1) {
                addressObj.city = address_component.long_name;
            }
            if (returnedIndexForState !== -1) {
                addressObj.state = address_component.long_name;
            }
        });

        Meteor.call('utility.getTimezone', selectedObj.location.lat, selectedObj.location.lng, (error, response) => {
            if (error) {
                Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
            } else {
                addressObj.timezoneId = response.data.timeZoneId;
                this.setState({
                    address: addressObj
                });
            }
        });
    }

    render() {
        let cityAndState = (this.state.address.city && this.state.address.state) ? (this.state.address.city + ', ' + this.state.address.state) : "";
        let desiredSalary = (this.state.desiredSalary !== "") ? numeral(this.state.desiredSalary).format('$ 0,0[.]00') : this.state.desiredSalary;

        return (
            <Col md={10} mdPush={1} className="personal-info-container signup-step-container">
                {(this.props.isOnSignupView) ?
                    <h1>Step 2: Personal Info</h1>
                    : null }
                <form ref={form => (this.personalInfoForm = form)} onSubmit={(e) => this.validatePersonalInfo(e)}>

                    {/* city and state */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Location</ControlLabel>
                                {/* Reference: https://github.com/ubilabs/react-geosuggest*/}
                                <Geosuggest
                                    initialValue={cityAndState}
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
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* current title, desired salary */}
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <ControlLabel>Current Title</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. Product Manager"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.currentTitle}
                                    name="currentTitle"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <ControlLabel>Desired Salary</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. 65000"
                                    value={desiredSalary}
                                    onChange={(e) => this.handleInputChange(e)}
                                    name="desiredSalary"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* phone, job search status, work auth status*/}
                    <Row>
                        <Col sm={6} md={4}>
                            <FormGroup>
                                <ControlLabel>Phone Number</ControlLabel>
                                <input
                                    className="form-control"
                                    type="tel"
                                    placeholder="Ex. (626) xxx-xxxx"
                                    value={formatPhoneNumber(this.state.phoneNumber)}
                                    onChange={(e) => this.handleInputChange(e)}
                                    name="phoneNumber"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6} md={4}>
                            <FormGroup>
                                <ControlLabel>Job Search Status</ControlLabel>
                                <Typeahead
                                    clearButton={true}
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    align="justify"
                                    onChange={(e) => this.handleInputChange(e, "jobSearchStatus")}
                                    options={_.map(getJobSearchStatusArray(),function(item){ return item })}
                                    placeholder= "Job Search Status"
                                    defaultSelected={this.state.jobSearchStatus}
                                    inputProps={{ 'name': 'jobSearchStatus', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={4}>
                            <FormGroup>
                                <ControlLabel>U.S. Work Authorization Status</ControlLabel>
                                <Typeahead
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    align="justify"
                                    clearButton={true}
                                    onChange={(e) => this.handleInputChange(e, "workAuthStatus")}
                                    options={_.map(
                                        workAuthStatusEnums, function(item) {
                                            return {
                                                "value":item.enum,
                                                "label":item.displayName
                                            }
                                        })}
                                    placeholder= "Work Authorization Status"
                                    defaultSelected={this.state.workAuthStatus}
                                    inputProps={{ 'name': 'workAuthStatus', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* about yourself */}
                    <Row>
                        <Col sm={12}>
                            <FormGroup>
                                <ControlLabel>Tell us about yourself (150 character limit)</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. Passionate about building fantastic, disruptive products"
                                    value={this.state.description}
                                    onChange={(e) => this.handleInputChange(e)}
                                    maxLength={150}
                                    name="description"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* perfect job desc */}
                    <Row>
                        <Col sm={12}>
                            <FormGroup>
                                <ControlLabel>Describe your perfect job. What type of company or role are you looking for?</ControlLabel>
                                <textarea
                                    className="form-control"
                                    type="text"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.perfectJobDesc}
                                    name="perfectJobDesc"
                                    placeholder="Tell us a little more about what you're looking for in your ideal job and company!">
                                </textarea>
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* next button */}
                    <Row>
                        <Col sm={12}>
                            <div className="button-container">
                                <Button className="btn-bg-orange btn-fat btn-wide" type="submit">{(this.props.isOnSignupView) ? "Next: Education" : "Save"}</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        )
    }
}

PersonalInfo.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
};

export default PersonalInfo;
