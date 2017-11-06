/*
created by: karina
created date: 8/23/17
*/

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Employees from './Employees';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
    //todo-ky add the other crud operations
    'employees.insert': function employeesInsert(employee) {
        //console.log('inside of employee.insert - here is the employee object',employee);

        if (!Employees.simpleSchema().newContext().validate(employee, keys=Object.keys(employee))){
            throw new Meteor.Error('500', "Invalid arguments passed");
        } else {
            console.log("checked the following keys: ", Object.keys(employee), "what value does this return?: ",
            !Employees.simpleSchema().validate(employee, keys=Object.keys(employee)));
        }

        try {
            // check(employee, {
            //     userId: String,
            //     companyId: String,
            //     completedSignUpSteps: Array
            // });

            //add all values (default)
            const id = Employees.insert(employee);
            //console.log('id employee', id);

            return id;
        }
        catch (err) {
            console.log('err - inside of employees/methods - insert', err);
            //throw new Meteor.Error('500', err);
            throw new Meteor.ValidationError('500', err);
        }

    },

    'employees.update': function employeesUpdate(employee) {
        //console.log('employee - inside of employees.update', employee);
        const employeeId = employee._id;
        delete employee._id;

        if (!Employees.simpleSchema().newContext().validate(employee, keys=Object.keys(employee))){
            throw new Meteor.Error('500', "Invalid arguments passed");
        } else {
            console.log("checked the following keys: ", Object.keys(employee), 
            "what value does this return?: ",
            Employees.simpleSchema().validate(employee, keys=Object.keys(employee)));
        }

        try {
            let result = Employees.update(employeeId, { $set: employee });
            //console.log('employee update result', result);
            return result;
        }
        catch (exception) {
            console.log('exception:', exception, "error error error! Abort! abort!");
            throw new Meteor.ValidationError('500', exception);
        }
    },

});


rateLimit({
    methods: [
        'employees.insert',
        'employees.update'
    ],
    limit: 5,
    timeRange: 1000,
});
