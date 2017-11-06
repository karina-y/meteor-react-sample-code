import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Employees from '../Employees';
import Companies from '../../Companies/Companies';
import UserEnums from '../../Users/enums';

const userRoles = UserEnums.USER_ROLE_ENUM;

Meteor.publish('employees', function employees() {
    return Employees.find();
});

Meteor.publish('employees.view.byEmployeeId', function employeeViewByEmployeeId(employeeId) {
    check(employeeId, String);
    return Employees.find({ _id: employeeId });
});

Meteor.publish('employees.view.byUserId', function employeeViewByUserId(userId) {
    check(userId, String);
    const employee = Employees.find({ userId: userId });
    return employee;
});

Meteor.publish('employees.view.byCompanyId', function employeeViewByCompanyId(companyId) {
    const listOfEmployees = Employees.find({ companyId: companyId });
    return listOfEmployees;
});

Meteor.publish("roomAndMessages", function (roomId) {
    check(roomId, String);
    return [
        Rooms.find({_id: roomId}),
        Messages.find({roomId: roomId})
    ];
});