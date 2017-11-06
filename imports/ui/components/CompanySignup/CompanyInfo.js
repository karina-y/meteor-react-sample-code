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
import Geosuggest from 'react-geosuggest';
import PropTypes from 'prop-types';
import validate from '../../../modules/validate';
import {Typeahead} from 'react-bootstrap-typeahead';
import {formatPhoneNumber, unformatPhoneNumber} from '../../methods/FormFieldsUiHelpers';
import { getCompanySizeArray } from './DropdownData/CompanySize';
import CompanyEnums from '../../../api/Companies/enums';
import NullChecks from '../../methods/NullChecks';

const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;

class CompanyInfo extends React.Component {
    constructor(props) {
        super(props);

        this.saveCompanyInfo = this.saveCompanyInfo.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleGmapsAutoCompleteInput = this.handleGmapsAutoCompleteInput.bind(this);
        this.validateCompanyInfo = this.validateCompanyInfo.bind(this);
        this.updateCompany = this.updateCompany.bind(this);
        this.setStateVariables = this.setStateVariables.bind(this);

        this.state = {
            userId: Accounts.userId(),
            companyName: props.companyObj.companyName,
            website: props.companyObj.website,
            companySize: props.companyObj.details.companySize,
            address: props.companyObj.address,
            description: props.companyObj.details.description,
            culture: props.companyObj.details.culture,
            benefits: props.companyObj.details.benefits,
            isFormValidatedAndSaved: false,
        }
    }

    componentDidMount(){
        //keeping track of what step the user is on (on parent component)
        this.props.updateCurrentStep(companySignupStepEnums.companyInfo.enum);
    }

    componentWillMount() {
        this.setStateVariables(this.props);
    }

    setStateVariables(props) {
        let companySize;
        const currentCompanySize = props.companyObj.details.companySize;

        if (currentCompanySize) {
            if (!NullChecks.isNullOrEmptyArray(currentCompanySize)) {
                //NOT setting to array because it already is one
                companySize = currentCompanySize;
            }
            else {
                //get companysize array
                Object.keys(getCompanySizeArray()).map(function(k){

                    if (getCompanySizeArray()[k].value === currentCompanySize) {
                        //setting to array because it's currently an obj and typeahead expects an array
                        companySize = [getCompanySizeArray()[k]];
                    }
                });
            }
        }

        this.setState({
            ['companySize']: companySize
        });
    }

    validateCompanyInfo(e) {
        if (e) {
            e.preventDefault();
        }

        let validationResult = validate($(this.companyInfoForm), {
            rules: {
                companyName: {
                    required: true
                },
                website: {
                    required: true,
                    validUrl: true
                },
                companySize: {
                    required: true
                },
                address: {
                    required: true
                },
                description: {
                    required: true
                },
                culture: {
                    required: false
                },
                benefits: {
                    required: false
                }
            },
            messages: {
                companyName: {
                    required: "What's your company's name?"
                },
                website: {
                    required: "Please provide your company's website, we know you have one.",
                    validUrl: "Please enter a valid URL"
                },
                companySize: {
                    required: "Please provide your company's size."
                },
                address: {
                    required: "Please provide your company's address.",
                    accept: "Only letters, numbers, and spaces are allowed in this field."
                },
                description: {
                    required: "What's your company all about?"
                }
            }
        });

        this.saveCompanyInfo(validationResult);
    }

    //function isValidated() is called when a user clicks on the top step nav (Basic Info, Personal Info, etc.)
    //this is how Stepzilla prevents users from moving to a different step before finishing their current step
    //*make sure each stepzilla component has this function
    isValidated() {
        if (this.props.isOnSignupView) {
            let isStepValid = this.state.isFormValidatedAndSaved;
            if (isStepValid === false) {
                this.validateCompanyInfo();
            }
            return isStepValid;
        } else {
            return true; //will allow user to skip around in steps - only in dashboard
        }
    }

    saveCompanyInfo(validator) {
        if (validator && validator.form() === true) {

            if (this.state.address == null || this.state.address.length == 0) {
                Bert.alert("Please select a phone type from the dropdown!", 'danger');
            }

            else if (this.state.companySize == null || this.state.companySize.length == 0 || this.state.companySize[0] == null) {
                Bert.alert("Please select your company's size from the dropdown!", 'danger');
            }

            else {
                const updatedCompanyObj = {
                    userId: this.state.userId,
                    companyName: this.state.companyName,
                    website: this.state.website,
                    details: {
                        companySize: this.state.companySize,
                        description: this.state.description,
                        culture: this.state.culture,
                        benefits: this.state.benefits
                    },
                    address: this.state.address
                };

                this.updateCompany(updatedCompanyObj);
            }

        }
        else {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
    }

    updateCompany(companyObj) {
        //saves original values to parent component
        this.props.updateCompanyAndEmployeeValues(companyObj, false, true);

        this.setState({isFormValidatedAndSaved: true});
        this.props.jumpToStep(companySignupStepEnums.companyInfo.enum);
    }

    handleInputChange(event, nameOfSelect) {

        let nameOfActiveField;
        let valOfField;

        if (!nameOfSelect) {
            nameOfActiveField = event.target.name;
            valOfField = event.target.value;

            if (nameOfActiveField === 'website') {
                valOfField = formatPhoneNumber(valOfField);
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

    handleGmapsAutoCompleteInput(selectedObj) {

        Meteor.call('utility.parseGoogleMapsAddress', selectedObj, (error, response) => {
            if (error) {
                Bert.alert("Invalid address, please try again!", 'danger');
            } else {
                this.setState({
                    address: response
                });
            }
        });
    }

    render() {
        let address = "";
        if (this.state.address.street1 && this.state.address.city && this.state.address.state && this.state.address.zip) {
            if (this.state.address.street2) {
                address = this.state.address.street1 + " " + this.state.address.street2 + ", " + this.state.address.city + ", " + this.state.address.state + " " + this.state.address.zip;
            }
            else {
                address = this.state.address.street1 + ", " + this.state.address.city + ", " + this.state.address.state + " " + this.state.address.zip;
            }

        }
        else if (this.state.address.city && this.state.address.state)
        {
            address = this.state.address.city + ", " + this.state.address.state;
        }

        return (
            <Col md={10} mdPush={1} className="company-info-container signup-step-container">

                {(this.props.isOnSignupView) ?
                    <h1>Step 3: Company Info</h1>
                    : null }

                <form ref={form => (this.companyInfoForm = form)} onSubmit={(e) => this.validateCompanyInfo(e)}>
                    {/* company name and company website */}
                    <Row>
                        <Col sm={5}>
                            <FormGroup>
                                <ControlLabel>Company Name</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. Betagig Inc."
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.companyName}
                                    name="companyName"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm={7}>
                            <FormGroup>
                                <ControlLabel>Company URL</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. www.betagig.tech"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.website}
                                    name="website"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* company size and address */}
                    <Row>
                        <Col sm={5}>
                            <FormGroup>
                                <ControlLabel>Company Size</ControlLabel>
                                <Typeahead
                                    clearButton={true}
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    align="justify"
                                    onChange={(e) => this.handleInputChange(e, "companySize")}
                                    options={_.map(getCompanySizeArray(),function(item){ return item })}
                                    placeholder="Ex. 1-5"
                                    defaultSelected={this.state.companySize}
                                    inputProps={{ 'name': 'companySize', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm={7}>
                            <FormGroup>
                                <ControlLabel>Company Address</ControlLabel>
                                <Geosuggest
                                    inputClassName="form-control"
                                    placeholder="Ex. 9200 Sunset Blvd, West Hollywood, CA 90069"
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

                    {/* description */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Company Description</ControlLabel>
                                <textarea
                                    rows="4"
                                    cols="10"
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. Our company is the best because..."
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.description}
                                    name="description"
                                >
                                </textarea>
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* culture */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Company Culture <i>(optional)</i></ControlLabel>
                                <textarea
                                    rows="4"
                                    cols="10"
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. Weekly laser-tag tournaments..."
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.culture}
                                    name="culture"
                                >
                                </textarea>
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* benefits */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Company Perks & Benefits <i>(optional)</i></ControlLabel>
                                <textarea
                                    rows="4"
                                    cols="10"
                                    className="form-control"
                                    type="text"
                                    placeholder="Ex. Medical, Dental, and free dry-cleaning..."
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.benefits}
                                    name="benefits"
                                >
                                </textarea>
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* next button */}
                    <Row>
                        <Col xs={12}>
                            <div className="button-container">
                                <Button className="btn-bg-orange btn-fat btn-wide" type="submit">{(this.props.isOnSignupView) ? "Next: Create a Job Posting" : "Save"}</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        )
    }
}

CompanyInfo.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
}
export default CompanyInfo;
