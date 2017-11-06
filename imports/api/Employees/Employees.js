import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import Companies from '../Companies/Companies';
import EmployeeEnums from './enums';
const employeeSignupEnums = EmployeeEnums.EMPLOYEE_SIGNUP_ENUM;

const Employees = new Mongo.Collection('Employees');
Employees.helpers({
    user() {
        return Meteor.users.findOne(
            { _id: this.userId }
        );
    },
    company() {
        return Companies.findOne(
            { _id: this.companyId },{
                fields:{
                    companyName: 1,
                    longDesc: 1
                }
            }
        );
    }
});

Employees.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Employees.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

Employees.schema = new SimpleSchema({
    userId: {
        type: String,
        defaultValue: ''
    },
    companyId: {
        type: String,
        defaultValue: ''
    },
    address: {
        type: Object,
        defaultValue: {}
    },
    "address.timezoneId": {
        type: String,
        defaultValue: ''
    },
    photos: {
        type: Object,
        defaultValue: {}
    },
    "photos.coverPhoto": {
        type: String,
        defaultValue: ''
    },
    "photos.profilePhotos": {
        type: Array,
        defaultValue: [],
        optional: true
    },
    "photos.mainProfilePhoto": {
        type: String,
        defaultValue: ''
    },
    details: {
        type: Object,
        defaultValue: {}
    },
    "details.jobTitle": {
        type: String,
        defaultValue: ''
    },
    "details.phoneNumber": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "details.phoneNumberExt": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "details.phoneNumberType": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "details.hostgigHoursCompleted": {
        type: Number,
        defaultValue: 0,
        optional: true
    },
    "details.hostgigHoursUpcoming": {
        type: Number,
        defaultValue: 0,
        optional: true
    },
    completedSignUpSteps: {
        type: Array,
        defaultValue: []
    },
    'completedSignUpSteps.$': {
        type: Number,
        allowedValues: Object.keys(employeeSignupEnums).map(function(k){ return parseInt(employeeSignupEnums[k].enum)}),
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) return (new Date());
        },
    },
    updatedAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) return (new Date());
        },
    }
});

Employees.attachSchema(Employees.schema);

export default Employees;
