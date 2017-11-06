/*
created by: karina
created date: 8/27/17
*/

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../modules/rate-limit';
import Companies from './Companies';
import Employees from '../Employees/Employees';
import UserEnums from '../Users/enums';
import NullChecks from '../../ui/methods/NullChecks';

const userRoles = UserEnums.USER_ROLE_ENUM;


Meteor.methods({

    //used to find the company admin's user data
    //data == companyId
    'companyController.getUserByCompanyId': function getUserByCompanyId(data){

        let ret = {
            'title': "Failed!",
            'message': "Employee Search By CompanyId Failed: " + "no reason provided",
            'type': null,
            'data': null
        };

        //get all employees with that companyid
        const employees = Employees.find({ companyId: data }, {sort: {createdAt: 1}}).fetch();

        if (NullChecks.isNullOrEmptyArray(employees)){
            ret.message = "Employee Search By CompanyId Failed";
            ret.type = "error";
        }

        //loop through them and get each one's user by employee.userid
        for (let i = 0; i < employees.length; i ++) {
            let employee = employees[i];

            let user = Meteor.users.findOne(employee.userId);

            //once a role of companyadmin has been found, return that user and break
            if (user && Roles.userIsInRole(user, userRoles.companyAdmin)) {

                //omit services
                delete user.services;

                ret.title = "Success!";
                ret.message = "Company Admin found!";
                ret.type = "success";
                ret.data = user;

                break;
            }
        }


        if (ret.type === "success") {
            return ret;
        }
        else if (ret.type === "error") {
            throw new Meteor.Error('500', ret);
        }
        else {
            //if we're here, we haven't found a companyadmin
            ret.type = "error";
            ret.message = "Employees found but no Company Admin role found";

            throw new Meteor.Error('500', ret);
        }


    },

    //data should be {userId: string, companyId: string, employeeId: string}
    'companyController.getCompanyAndNameById': function getCompanyAndNameById(data){
        //data should be {userId: string, companyId: string, employeeId: string}

        let ret = {
            'title': "Success!",
            'message': "Successfully Found Company!",
            'type': "success",
            'data': null
        };

        let user;
        let company;
        let employee;

        if (data.userId) {
            user = Meteor.users.findOne({_id: data.userId});
            employee = user == null ? null : Employees.findOne({userId: data.userId});
            company = employee == null ? null : Companies.findOne({_id: employee.companyId});

            if (!user || !employee || !company) {
                ret.message = "Couldn't find with userId";
            }
            else {
                company.name = user.profile.name;

                ret.data = company;
            }
        }
        else if (data.employeeId) {
            employee = Employees.findOne({_id: data.employeeId});
            user = employee == null ? null :  Meteor.users.findOne({_id: employee.userId});
            company = employee == null ? null :  Companies.findOne({_id: employee.companyId});

            if (!employee || !user || !company) {
                ret.message = "Couldn't find with employeeId";
            }
            else {
                company.name = user.profile.name;

                ret.data = company;
            }
        }
        else if (data.companyId) {
            const employees = Employees.find({ companyId: data }, {sort: {createdAt: 1}}).fetch();

            if (NullChecks.isNullOrEmptyArray(employees)){
                ret.message = "Employee Search By CompanyId Failed";
            }

            //loop through them and get each one's user by employee.userid
            for (let i = 0; i < employees.length; i ++) {
                employee = employees[i];

                user = Meteor.users.findOne(singleEmployee.userId);

                //once a role of companyadmin has been found, return that user and break
                if (user && Roles.userIsInRole(user, userRoles.companyAdmin)) {

                    company.name = user.profile.name;
                    ret.data = company;

                    break;
                }
            }
        }


        if (!company || company.name == null) {
            console.log("***ERROR", company);

            ret.title = "Error!";
            ret.type = "error";
            throw new Meteor.Error('500', ret);
        }
        else {
            return ret;
        }
    },

    //data should be {userId: string, companyId: string, employeeId: string}
    'companyController.getCompanyAndAdminById': function getCompanyAndAdminById(data){

        let ret = {
            'title': "Success!",
            'message': "Successfully Found Company!",
            'type': "success",
            'data': null
        };

        let user;
        let company;
        let employee;

        if (data.userId) {
            user = Meteor.users.findOne({_id: data.userId});
            employee = user == null ? null : Employees.findOne({userId: data.userId});
            company = employee == null ? null : Companies.findOne({_id: employee.companyId});

            if (!user || !employee || !company) {
                ret.message = "Couldn't find with userId";
            }
            else {
                company.name = user.profile.name;
                employee.name = user.profile.name;

                ret.data = {company: company, employee: employee};
            }
        }
        else if (data.employeeId) {
            employee = Employees.findOne({_id: data.employeeId});
            user = employee == null ? null :  Meteor.users.findOne({_id: employee.userId});
            company = employee == null ? null :  Companies.findOne({_id: employee.companyId});

            if (!employee || !user || !company) {
                ret.message = "Couldn't find with employeeId";
            }
            else {
                company.name = user.profile.name;
                employee.name = user.profile.name;

                ret.data = {company: company, employee: employee};
            }
        }
        else if (data.companyId) {
            const employees = Employees.find({ companyId: data }, {sort: {createdAt: 1}}).fetch();

            if (NullChecks.isNullOrEmptyArray(employees)){
                ret.message = "Employee Search By CompanyId Failed";
            }

            //loop through them and get each one's user by employee.userid
            for (let i = 0; i < employees.length; i ++) {
                employee = employees[i];

                user = Meteor.users.findOne(singleEmployee.userId);

                //once a role of companyadmin has been found, return that user and break
                if (user && Roles.userIsInRole(user, userRoles.companyAdmin)) {
                    company.name = user.profile.name;
                    employee.name = user.profile.name;

                    ret.data = {company: company, employee: employee};

                    break;
                }
            }
        }


        if (!company || company.name == null) {
            console.log("***ERROR", company);

            ret.title = "Error!";
            ret.type = "error";
            throw new Meteor.Error('500', ret);
        }
        else {
            return ret;
        }
    },
});


rateLimit({
    methods: [
        'companyController.getUserByCompanyId',
        'companyController.getCompanyAndNameById',
        'companyController.getCompanyAndAdminById'
    ],
    limit: 5,
    timeRange: 1000,
});
