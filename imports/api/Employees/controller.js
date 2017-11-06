import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../modules/rate-limit';
import Employees from './Employees';
import sendHtmlEmail from '../../../server/email';
import { formatPhoneNumber } from '../../ui/methods/FormFieldsUiHelpers';
import UserEnums from '../Users/enums';

const userRoles = UserEnums.USER_ROLE_ENUM;
const _defaultEmployeePassword = Meteor.settings.private.NEW_EMPLOYEE.tempPassword;

Meteor.methods({
    //adds user + employee objects - sends out emails to companies + new employees
    'employeeController.addUserAndEmployee': function addUserAndEmployee(data){
        let ret = {
            'title': 'Success! ',
            'message': "You've created an employee record! ",
            'type': 'success',
            'userId': "",
            'employeeId': ""
        };
        try {
            let userData = {
                profile: {
                    name: {
                        first: s(data.user.firstName).trim().capitalize().value(),
                        middle: s(data.user.middleName).trim().capitalize().value(),
                        last: s(data.user.lastName).trim().capitalize().value()
                    }
                },
                password: _defaultEmployeePassword,
                email: data.user.email,
                roles: data.user.roles,
                agreements: data.user.agreements,
                createdByAdmin: data.user.createdByAdmin
            }

            //Make call to create the user object
            Meteor.call('users.addUser', userData, (error, userId) => {

                if (error) {
                    ret.title = "Error!";
					ret.message = "error inserting employee";
					ret.details = error;
					ret.type = "error";

					return ret;
                }
                if (userId) {
                    ret.userId = userId;
                    let employeeData = {
                        companyId: data.employee.companyId,
                        completedSignUpSteps: data.employee.completedSignUpSteps,
                        userId: userId,
                        details: {
                            jobTitle: s(data.employee.details.jobTitle).trim().capitalize().value(),
                            phoneNumber: data.employee.details.phoneNumber,
                            phoneNumberExt: data.employee.details.phoneNumberExt,
                            phoneNumberType: data.employee.details.phoneNumberType
                        }
                    };

                    Meteor.call('employees.insert', employeeData, (error, employeeId) => {
                        
						if (error) {
                            ret.title = "Error!";
							ret.message = "error inserting employee";
							ret.details = error;
							ret.type = "error";
							
							return ret;
                        }
                        
						ret.employeeId = employeeId;

                        const isEmployee = userData.roles.includes(userRoles.employee);
                        const isCompanyAdmin = userData.roles.includes(userRoles.companyAdmin);
                        const isInactive = userData.roles.includes(userRoles.inactive);
                        let adminOrEmployeeRole = (isCompanyAdmin) ? userRoles.companyAdmin : userRoles.employee;

                        let emailData = {
                            'subject': 'Your company has added you to their list of employees!',
                            'title': 'THIS IS A TEST',
                            'firstName': (userData.profile.name.first) ? userData.profile.name.first : 'N/A',
                            'middleName': (userData.profile.name.middle) ? userData.profile.name.middle : 'N/A',
                            'lastName': (userData.profile.name.last) ? userData.profile.name.last : 'N/A',
                            'email': userData.email,
                            'roles': s(adminOrEmployeeRole).trim().capitalize().value(),
                            'isActive': s(!isInactive).trim().capitalize().value(),
                            'password': _defaultEmployeePassword,
                            'jobTitle': employeeData.details.jobTitle,
                            'phoneNum': (employeeData.details.phoneNumber) ? formatPhoneNumber(employeeData.details.phoneNumber) : 'N/A',
                            'phoneNumExt': (employeeData.details.phoneNumberExt) ? employeeData.details.phoneNumberExt : 'N/A',
                            'phoneNumType': (employeeData.details.phoneNumberType) ? employeeData.details.phoneNumberType : 'N/A',
                            'baseUrl': Meteor.absoluteUrl(),
                            'id': userData._id
                        };

                        //template to us, to (employee), from (betagig), subject header, data
                        const defaultFrom = 'support@betagig.tech';
                        const from = Meteor.settings.private.emails.new_employee_via_company_admin.from || defaultFrom;

                        // template to us, to (employee), from (betagig), subject header, data

                        // #1 - on success of a company creating an employee - email employee to let them know - company has added you!
                        sendHtmlEmail(emailData.email, from, 'Welcome to Betagig!', emailData, 'new_employee_added_employee');

                        // update emailData to prep email to send to company:
                        emailData.subject = 'You have added a new employee!';
                        delete emailData.password;

                        // #2 - email company to confirm they have added employee
                        sendHtmlEmail(Meteor.user().emails[0].address, from, 'Betagig Action: Added Employee ', emailData, 'new_employee_added_company');

                        return ret;
                    });
                }
                return ret;
            });
			
            return ret;
			
        } catch (exception) {
            throw new Meteor.ValidationError('500', exception);
        }
    },

    //edits user + employee objects - sends out emails to companies + new employees
    'employeeController.updateUserAndEmployee': function updateUserAndEmployee(data){
        let ret = {
            'title': 'Success! ',
            'message': "You've successfully updated an employee record! ",
            'type': 'success'
        };

        try {
            let userData = {
                profile: {
                    name: {
                        first: data.user.firstName,
                        middle: data.user.middleName,
                        last: data.user.lastName
                    }
                },

                emailAddress: data.user.email,
                roles: data.user.roles,
                agreements: data.user.agreements,
                _id: data.user._id
            };

            //Make call to create the user object
            Meteor.call('users.editProfile', userData, (error) => {
                if (error) {
                    ret.type = "error";
                    ret.message = error;
                    let emailAlreadyExists = s.include(error.reason, "E11000");
                    
                    if (emailAlreadyExists) {
                        ret.message = "Email is already taken. Please provide another one!"
                    }
                    
					return ret;
                }

                if (!error && userData._id) {
                    let employeeData = {
                        companyId: data.employee.companyId,
                        completedSignUpSteps: data.employee.completedSignUpSteps,
                        userId: userData._id,
                        _id: data.employee._id,
                        details: {
                            jobTitle: data.employee.details.jobTitle,
                            phoneNumber: data.employee.details.phoneNumber,
                            phoneNumberExt: data.employee.details.phoneNumberExt,
                            phoneNumberType: data.employee.details.phoneNumberType
                        }
                    };

                    const isEmployee = userData.roles.includes(userRoles.employee);
                    const isCompanyAdmin = userData.roles.includes(userRoles.companyAdmin);
                    const isInactive = userData.roles.includes(userRoles.inactive);
                    let adminOrEmployeeRole = (isCompanyAdmin) ? userRoles.companyAdmin : userRoles.employee;

                    Meteor.call('employees.update', employeeData, ( error, employeeId ) => {
                        if (error) {
                            ret.title = 'Failed';
                            console.log("ERROR: ", error);
                            ret.message = error.reason;
                            return ret;
                        }

                        let emailData = {
                            'subject': 'Your company has edited your employee profile!',
                            'title': 'THIS IS A TEST',
                            'firstName': (userData.profile.name.first) ? userData.profile.name.first : 'N/A',
                            'middleName': (userData.profile.name.middle) ? userData.profile.name.middle : 'N/A',
                            'lastName': (userData.profile.name.last) ? userData.profile.name.last : 'N/A',
                            'email': userData.emailAddress,
                            'roles': s(adminOrEmployeeRole).trim().capitalize().value(),
                            'isActive': s(!isInactive).trim().capitalize().value(),
                            'jobTitle': employeeData.details.jobTitle,
                            'phoneNum': (employeeData.details.phoneNumber) ? formatPhoneNumber(employeeData.details.phoneNumber) : 'N/A',
                            'phoneNumExt': (employeeData.details.phoneNumberExt) ? employeeData.details.phoneNumberExt : 'N/A',
                            'phoneNumType': (employeeData.details.phoneNumberType) ? employeeData.details.phoneNumberType : 'N/A',
                            'baseUrl': Meteor.absoluteUrl(),
                            'id': userData._id
                        };

                        const defaultFrom = 'support@betagig.tech';
                        const from = Meteor.settings.private.emails.new_employee_via_company_admin.from || defaultFrom;

                        // template to us, to (employee), from (betagig), subject header, data

                        // #1 - send out email to employee here (company has updated your profile)
                        sendHtmlEmail(emailData.email, from, 'Betagig Action: Employee Profile Changes', emailData, 'existing_employee_updated_employee');

                        // then, update emailData to prep email to send to company:
                        emailData.subject = 'You have edited an employee profile!';

                        // #2 - send out email to company here (you have updated an employee record)
                        sendHtmlEmail(Meteor.user().emails[0].address, from, 'Betagig Action: Employee Profile Changes', emailData, 'existing_employee_updated_company');

                        //ret.message = ret.message + "(EmployeeId: " + employeeId + ")";
                        return ret;
                    });
                }
            });
			
            return ret;
			
        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    }
});


rateLimit({
    methods: [
        'employeeController.addUserAndEmployee',
        'employeeController.updateUserAndEmployee'
    ],
    limit: 5,
    timeRange: 1000,
});
