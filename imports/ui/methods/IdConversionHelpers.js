/*
created by: karina
created date: 10/11/17
*/

import { Meteor } from 'meteor/meteor';
import Careers from '../../api/Careers/Careers';
import NullChecks from './NullChecks';

const IdConversionHelpers = {};

//receives _id and returns the appropriate title
const careerIdToTitle = function(careerId) {
    const careerSubscription = Meteor.subscribe('careers');
    const careers = Careers.find().fetch();

    let returnObj = {error: null, value: null};

    if (careerSubscription.ready() && NullChecks.isNullOrEmptyArray(careers)) {
        const matchingKey = Object.keys(careers).find(key => careers[key]._id === careerId);

        returnObj.value = careers[matchingKey].title;
    }
    else {
        returnObj.error = "no careers found";
    }

    return returnObj;
};

//receives title and returns the appropriate _id
const careerTitleToId = function(careerTitle) {
    const careerSubscription = Meteor.subscribe('careers');
    const careers = Careers.find().fetch();

    let returnObj = {error: null, value: null};

    if (careerSubscription.ready() && NullChecks.isNullOrEmptyArray(careers)) {
        const matchingKey = Object.keys(careers).find(key => careers[key].title === careerTitle);

        returnObj.value = careers[matchingKey]._id;
    }
    else {
        returnObj.error = "no careers found";
    }

    return returnObj;
};

IdConversionHelpers.careerIdToTitle = careerIdToTitle;
IdConversionHelpers.careerTitleToId = careerTitleToId;


export default IdConversionHelpers;
