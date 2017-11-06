import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Companies from './Companies';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
    //todo-ky add the other crud operations
    'companies.insert': function companiesInsert(company) {
        try {
            check(company, {
                completedSignUpSteps: Array,
                isVisible: Boolean,
                isDeleted: Boolean
            });

            const companyId = Companies.insert(company);
            return companyId;
        }
        catch (exception) {
            throw new Meteor.Error('500', exception);
        }

    },

    'admin.companies.insert': function adminCompaniesInsert(company) {
        check(company, {
            companyName: String,
            state: String,
            street: String,
            street2: String,
            website: String,
            zip: String
        });

        if(!Companies.simpleSchema().newContext().validate(company, keys=Object.keys(company))){
            throw new Meteor.Error('500', "Invalid arguments passed");
        }

        try {
            let doneCbFunc = function(err, response) {
                console.log("ERROR:", err, "RESPONSE", response);
            }

            return Companies.insert({
                companyName: company.companyName,
                state: company.state,
                street: company.street,
                street2: company.street2,
                website: company.website,
                zip: company.zip
            }, doneCbFunc);
        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },

    'companies.update': function companiesUpdate(company) {
        //console.log('company - inside of companies.update', company);
        let companyId;
        if (company._id) {
            companyId = company._id;
            delete company._id;
        } else if (company.companyId){
            companyId = company.companyId;
            delete company.companyId;
        }

        if (!Companies.simpleSchema().newContext().validate(company, keys=Object.keys(company))){
            throw new Meteor.Error('500', "Invalid arguments passed");
        }

        try {
           let cbDoneFunction = function(err, result) {
            console.log('err', err, 'result', result);
           };
           Companies.update(companyId, { $set: company }, {}, cbDoneFunction);
        }
        catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },
});

rateLimit({
    methods: [
        'companies.insert',
        'admin.companies.insert',
        'companies.update'
    ],
    limit: 5,
    timeRange: 1000,
});
