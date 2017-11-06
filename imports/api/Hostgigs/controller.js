import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Hostgigs from './Hostgigs';
import rateLimit from '../../modules/rate-limit';
import SharedEnums from '/imports/api/Shared/enums';

Meteor.methods({
    'hostgigController.update': function hostgigUpdate(data) {
        check(data, Object);

        let ret = {
            'title': 'Success! ',
            'message': "You've updated this hostgig!",
            'type': 'success'
        };

        try {
            // Make call to hostgigs.update
            Meteor.call('hostgigs.update', data, ( error, hostgigId ) => {
                if( error ) {
                    ret.title = 'Failed';
                    console.log("ERROR: ", error);
                    ret.message = error.reason;
                    return ret;
                }
            });

            return ret;

        } catch (exception) {
            console.log("Exception: ", exception);
            throw new Meteor.Error('500', exception);
        }
    },
    'hostgigController.insert': function hostgigsInsert(hostgig) {
        let ret = { 
            'title': 'Success! ',
            'message': "You've created a job posting!",
            'type': 'success'
        };

        try {

            if( ! Hostgigs.simpleSchema().newContext().validate(hostgig,keys=Object.keys(hostgig))){
                throw new Meteor.Error('500', "Invalid arguments passed");
            }

            Meteor.call('hostgigs.insert', hostgig, ( error, hostgigId ) => {
                if( error ) {
                    ret.title = 'Failed';
                    console.log("ERROR: ", error);
                    ret.message = error.reason;
                    return ret;
                }
            });

            return ret;

        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },
});
