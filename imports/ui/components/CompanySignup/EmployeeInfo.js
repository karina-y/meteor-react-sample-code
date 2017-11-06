/*
created by: karina
created date: 8/18/17
*/

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
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import validate from '../../../modules/validate';
import {Typeahead} from 'react-bootstrap-typeahead';
import {formatPhoneNumber, unformatPhoneNumber} from '../../methods/FormFieldsUiHelpers';
import { getPhoneNumberTypeArray } from './DropdownData/PhoneNumberType';
import numeral from 'numeral';
import CompanyEnums from '../../../api/Companies/enums';

const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;

/*
todo-ky
- pass in button text and header as a prop
    - will be using this in future use for company dashboard

*/

class EmployeeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.saveEmployeeInfo = this.saveEmployeeInfo.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateEmployeeInfo = this.validateEmployeeInfo.bind(this);
        this.updateEmployee = this.updateEmployee.bind(this);
        this.setStateVariables = this.setStateVariables.bind(this);

        //todo-ky set all state properties to null, create a componentWillMount and assign the appropriate values to the state
        //look at admin.js as an example
        //props are acceptable as is accounts.userid() (so i don't need to change employeeinfo, but keep an eye out for the future)
        //if you need to run any calculations/functions/etc, do it in componentwillmount

        this.state = {
            userId: Accounts.userId(),
            jobTitle: props.employeeObj.details.jobTitle,
            phoneNumber: props.employeeObj.details.phoneNumber,
            phoneNumberExt: props.employeeObj.details.phoneNumberExt,
            phoneNumberType: props.employeeObj.details.phoneNumberType,
            isFormValidatedAndSaved: false,
        }
    }

    componentDidMount(){
        //keeping track of what step the user is on (on parent component
        this.props.updateCurrentStep(companySignupStepEnums.employeeInfo.enum);
    }

    componentWillMount() {
        this.setStateVariables(this.props);
    }

    setStateVariables(props) {
        let phoneNumberType = [];
        const currentPhoneNumberType = props.employeeObj.details.phoneNumberType;

        if (currentPhoneNumberType) {
            if (Array.isArray(currentPhoneNumberType) && currentPhoneNumberType.length > 0) {
                //NOT setting to array because it already is one
                phoneNumberType = currentPhoneNumberType;
            } else {
                //get phonetype array
                Object.keys(getPhoneNumberTypeArray()).map(function(k){

                    if (getPhoneNumberTypeArray()[k].value === currentPhoneNumberType) {
                        //setting to array because it's currently an obj and typeahead expects an array
                        phoneNumberType = [getPhoneNumberTypeArray()[k]];
                    }
                });
            }
        }

        this.setState({
            ['phoneNumberType']: phoneNumberType
        });
    }

    validateEmployeeInfo(e) {
        if (e) {
            e.preventDefault();
        }

        let validationResult = validate($(this.employeeInfoForm), {
            rules: {
                jobTitle: {
                    required: true,
                    accept: "[a-zA-Z ]+"
                },
                phoneNumber: {
                    required: true,
                    validPhoneNumber: true
                },
                phoneNumberExt: {
                    required: false,
                    accept: "^[0-9]*$"
                },
                phoneNumberType: {
                    required: true,
                    accept: "[a-zA-Z ]+"
                }
            },
            messages: {
                jobTitle: {
                    required: 'What\'s your current title?',
                    accept: "Only letters and spaces are allowed in this field."
                },
                phoneNumber: {
                    required: "Please provide the best number to contact you."
                },
                phoneNumberExt: {
                    accept: "Only numbers are allowed in this field."
                },
                phoneNumberType: {
                    required: "What type of phone number did you provide?",
                    accept: "Only letters and spaces are allowed in this field."
                },
            }
        });

        this.saveEmployeeInfo(validationResult);
    }

    //function isValidated() is called when a user clicks on the top step nav (Basic Info, Personal Info, etc.)
    //this is how Stepzilla prevents users from moving to a different step before finishing their current step
    //*make sure each stepzilla component has this function
    isValidated() {
        if (this.props.isOnSignupView) {
            let isStepValid = this.state.isFormValidatedAndSaved;
            if (isStepValid === false) {
                this.validateEmployeeInfo();
            }
            return isStepValid;
        } else {
            return true; //will allow user to skip around in steps - only in dashboard
        }
    }

    saveEmployeeInfo(validator) {
        if (validator && validator.form() === true) {

            if (this.state.phoneNumberType == null || this.state.phoneNumberType.length == 0) {
                Bert.alert("Please select a phone type from the dropdown!", 'danger');
            }

            const updatedEmployeeObj = {
                userId: this.state.userId,
                details: {
                    jobTitle: this.state.jobTitle,
                    phoneNumber: this.state.phoneNumber,
                    phoneNumberExt: this.state.phoneNumberExt,
                    phoneNumberType: this.state.phoneNumberType
                }
            };

            //let updatedEmployeeObj = _.omit(this.state, "isFormValidatedAndSaved");
            this.updateEmployee(updatedEmployeeObj);
        } else {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
    }

    updateEmployee(employeeObj) {
        this.props.updateCompanyAndEmployeeValues(employeeObj, false, true);   //saves original values to parent component

        if (this.props.isOnSignupView) {
            this.setState({isFormValidatedAndSaved: true});
            this.props.jumpToStep(companySignupStepEnums.employeeInfo.enum);
        }
    }

    handleInputChange(event, nameOfSelect) {

        let nameOfActiveField;
        let valOfField;

        if (!nameOfSelect) {
            nameOfActiveField = event.target.name;
            valOfField = event.target.value;


            if (nameOfActiveField === 'phoneNumber') {
                valOfField = formatPhoneNumber(valOfField);
            }

            if (nameOfActiveField === 'phoneNumberExt') {
                const isInt = /^\d+$/.test(valOfField);

                if (isInt && (valOfField != null && valOfField !== '') && parseInt(valOfField) < 0) {
                    Bert.alert("Invalid phone number extension", 'danger');
                }

                if (!isInt) {
                    Bert.alert("Please enter only digits in phone number extension", 'danger');
                }
            }

        } else {
            //this code block will deal with select elements - param 'nameOfSelect' will NOT be null
            nameOfActiveField = nameOfSelect;
            valOfField = [event[0]];
        }

        this.setState({
            [nameOfActiveField]: valOfField
        });
    }

    render() {
        return (
            <Col md={10} mdPush={1} className="employee-info-container signup-step-container">

                {(this.props.isOnSignupView) ?
                    <h1>Step 2: Employee Info</h1>
                    : null }

                <form ref={form => (this.employeeInfoForm = form)} onSubmit={(e) => this.validateEmployeeInfo(e)}>
                    {/* job title */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Your Job title</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Job Title"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.jobTitle}
                                    name="jobTitle"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* phone number, ext, and type */}
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <ControlLabel>Phone Number</ControlLabel>
                                <input
                                    className="form-control"
                                    type="tel"
                                    name="phoneNumber"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.phoneNumber}
                                    placeholder="Phone Number"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={3}>
                            <FormGroup>
                                <ControlLabel>Ext.</ControlLabel>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="phoneNumberExt"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.phoneNumberExt}
                                    placeholder="Ext."
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={3}>
                            <FormGroup>
                                <ControlLabel>Type</ControlLabel>
                                <Typeahead
                                    clearButton={true}
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    align="justify"
                                    onChange={(e) => this.handleInputChange(e, "phoneNumberType")}
                                    options={_.map(getPhoneNumberTypeArray(),function(item){ return item })}
                                    placeholder= "Phone Type"
                                    defaultSelected={this.state.phoneNumberType}
                                    inputProps={{ name: 'phoneNumberType', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* next button */}
                    <Row>
                        <Col xs={12}>
                            <div className="button-container">
                                <Button className="btn-bg-orange btn-fat btn-wide" type="submit">{(this.props.isOnSignupView) ? "Next: Tell Us About Your Company" : "Save"}</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        )
    }
}

EmployeeInfo.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
};

export default EmployeeInfo;
