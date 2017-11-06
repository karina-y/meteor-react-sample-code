import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Companies from '../Companies';

Meteor.publish('companies', function companies() {
    return Companies.find();
});

Meteor.publish('companies.view', function companiesView(companyId) {
    return Companies.find({ _id: companyId });
});