import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Employees from './Employees';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({

    'employees.insert': function employeesInsert(employee) {

        if (!Employees.simpleSchema().newContext().validate(employee, keys=Object.keys(employee))){
            throw new Meteor.Error('500', "Invalid arguments passed");
        } else {
            console.log("checked the following keys: ", Object.keys(employee), "what value does this return?: ",
            !Employees.simpleSchema().validate(employee, keys=Object.keys(employee)));
        }

        try {

            //add all values (default)
            const id = Employees.insert(employee);

            return id;
        }
        catch (err) {
            throw new Meteor.ValidationError('500', err);
        }

    },

    'employees.update': function employeesUpdate(employee) {
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
            return result;
        }
        catch (exception) {
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
