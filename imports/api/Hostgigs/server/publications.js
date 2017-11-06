import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Hostgigs from '../Hostgigs';
import Companies from '../../Companies/Companies';
import Careers from '../../Careers/Careers';
import { Mongo } from 'meteor/mongo';
import { publishComposite } from 'meteor/reywood:publish-composite';

Meteor.publish('hostgigs', function hostgigs(limit){
  return Hostgigs.find({},{
      fields: {
          imageUrl: 1,
          jobTitle: 1,
          experienceLevel: 1,
          lat: 1,
          long: 1,
          careerId: 1,
          companyId: 1,
          zip: 1
      }
  });
});

Meteor.publish('hostgigs.byCompany', function hostgigs(companyId){
    return Hostgigs.find({
        companyId: companyId,
        isDeleted: false
    });
});

Meteor.publish('hostgigs.view', function hostgigsView(hostgigId) {
	check(hostgigId, String);
	return Hostgigs.find({ _id: hostgigId });
});

Meteor.publish('hostgigs.all', function(){
	return Hostgigs.find({},{ sort: {createdAt: -1}});
});

Meteor.publish('hostgigs.all.lite', function(){
	return Hostgigs.find({},{
    fields: {
        imageUrl: 1,
        jobTitle: 1,
        address: 1
    }
  });
});

Meteor.publish('hostgigs.view.byCompanyId', function hostgigsView(companyId) {
    check(companyId, String);
    return Hostgigs.find({ companyId: companyId });
});

publishComposite('hostgigs.paged', function(limit){
    return {
    	find(){
    		return Hostgigs.find({}, {
                limit: limit,
                fields: {
                    imageUrl: 1,
                    jobTitle: 1,
                    lat: 1,
                    long: 1,
                    careerId: 1,
                    companyId: 1
                }
            });
    	},
    	children: [
    		{
      			find(hostgig){
      				return Companies.find(
                          {"_id": new Mongo.ObjectID(hostgig.companyId)},
                          { fields: { companyName: 1, } });
      			}
    		},
        {
            find(hostgig) {
                return Careers.find({ "_id": new Mongo.ObjectID(hostgig.careerId) });
            }
        }
    	]
    }
});

publishComposite('hostgig.view', function(hostgigId){
	check(hostgigId, String);
	return {
	    find() {
	        return Hostgigs.find({"_id":new Mongo.ObjectID(hostgigId)});
	    },
	    children: [
	        {
	            find(hostgig) {
	                return Companies.find({ "_id": new Mongo.ObjectID(hostgig.companyId) });
	            }
	        },
          {
              find(hostgig) {
                  return Careers.find({ "_id": new Mongo.ObjectID(hostgig.careerId) });
              }
          }
	    ]
	}
});

publishComposite('hostgigs.related', function hostgigsRelated(hostgigId) {
   check(hostgigId, String);

   return {
       find() {
           return Hostgigs.find({"_id":new Mongo.ObjectID(hostgigId)});
       },
       children: [
           {
               find(hostgig) {
                   return Hostgigs.find({careerId: hostgig.careerId});
               }
           },
           {
               find(hostgig) {
                   return Companies.find({ "_id": new Mongo.ObjectID(hostgig.companyId) });
               }
           },
           {
               find(hostgig) {
                   return Careers.find({ "_id": new Mongo.ObjectID(hostgig.careerId) });
               }
           }
       ]
   }
});
