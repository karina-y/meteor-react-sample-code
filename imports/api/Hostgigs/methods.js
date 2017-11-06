import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Hostgigs from './Hostgigs';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
    'signup.hostgigs.insert': function hostgigsInsert(hostgig) {
        hostgig.experienceLevel = parseInt(hostgig.experienceLevel);
        hostgig.educationLevel = parseInt(hostgig.educationLevel);

        if (!Hostgigs.simpleSchema().newContext().validate(hostgig, keys=Object.keys(hostgig))){
            throw new Meteor.Error('500', "Invalid arguments passed");
        }

        try {
			//logging purposes only
            let onDoneFunction = function(err, response) {
                console.log(err, response, "Debugging tool - inside of signup.hostgigs.insert");
            };
            return Hostgigs.insert(hostgig, {}, onDoneFunction);
        }

        catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },

    'hostgigs.update': function hostgigsUpdate(data) {
        check(data, Object);

        const hostgigId = data._id;
        delete data.id;


        try {
            //logging purposes only
            let onDoneFunction = function(err, response) {
                console.log(err, response, "Debugging tool - inside of candidate methods.js");
            };
			
            return Hostgigs.update(hostgigId, { $set: data }, onDoneFunction);
        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },

    'hostgigs.remove': function hostgigsRemove(hostgigId) {
        check(hostgigId, String);

        try {
            return Hostgigs.remove(hostgigId);
        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },

    'hostgigs.insert': function hostgigInsert(hostgig){
        check(hostgig, Object);

        try {
            return Hostgigs.insert(hostgig);
        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    }
});

rateLimit({
    methods: [
        'hostgigs.insert',
        'signup.hostgigs.insert',
        'hostgigs.update',
        'hostgigs.remove',
    ],
    limit: 5,
    timeRange: 1000,
});
