/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import Companies from '../Companies/Companies';
import Betagigs from '../Betagigs/Betagigs';
import Careers from '../Careers/Careers';
import SharedEnums from '../Shared/enums';
let moment = require('moment');

const educationLevelEnums = SharedEnums.EDUCATION_LEVEL_ENUM;
const experienceLevelEnums = SharedEnums.EXPERIENCE_LEVEL_ENUM;

const Hostgigs = new Mongo.Collection('Hostgigs');
Hostgigs.helpers({
    betagig(candidateId){
        return Betagigs.findOne(
            { hostgigId: this._id }
        );
    },
    company() {
        return Companies.findOne(
            { _id: this.companyId },{
                fields:{
                    companyName: 1,
                    longDesc: 1,
                    photos: 1,
                    website: 1
                }
            }
        );
    },
    career() {
        return Careers.findOne(
            { _id: this.careerId }
        );
    }
});


Hostgigs.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Hostgigs.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

Hostgigs.schema = new SimpleSchema({
    additionalDetails: {
        type: String,
        defaultValue: ''
    },
    availability: {
        type: Array,
        defaultValue: []
    },
    careerId: {
        type: String,
        defaultValue: ''
    },
    careerCategoryId: {
        type: String,
        defaultValue: ''
    },
    companyId: {
        type: String,
        defaultValue: ''
    },
    dressCode: {
        type: String,
        defaultValue: ''
    },
    experienceLevel: {
        type: Number,
        allowedValues: Object.keys(experienceLevelEnums).map(function(k){ return parseInt(experienceLevelEnums[k].enum) }),
        defaultValue: 0
    },
    experienceLevelPreferred: {
        type: Boolean,
        defaultValue: false
    },
    educationLevel: {
        type: Number,
        allowedValues: Object.keys(educationLevelEnums).map(function(k){ return parseInt(educationLevelEnums[k].enum) }),
        defaultValue: 0
    },
    educationLevelPreferred: {
        type: Boolean,
        defaultValue: false
    },
    expirationDate: {
        type: Date,
        autoValue() {
            if (this.isInsert)
                return (moment().add(10, 'days').toDate());
        },
    },
    gigDetails: {
        type: String,
        defaultValue: ''
    },
    imageUrl: {
        type: String,
        defaultValue: ''
    },
    isActive: {
        type: Boolean,
        defaultValue: true
    },
    isDeleted: {
        type: Boolean,
        defaultValue: false
    },
    jobTitle: {
        type: String,
        defaultValue: ''
    },
    minSalary: {
        type: String,
        defaultValue: '$0'
    },
    maxSalary: {
        type: String,
        defaultValue: '$0'
    },
    mustHaves: {
        type: Array,
        defaultValue: []
    },
    niceToHaves: {
        type: Array,
        defaultValue: []
    },
    preReq: {
        type: Array,
        defaultValue: []
    },
    prioritizeMinorities: {
        type: Boolean,
        defaultValue: false
    },
    responsibilities: {
        type: Array,
        defaultValue: []
    },
    restrictAccessByUser: {
        type: Array,
        defaultValue: []
    },
    restrictAccessByScore: {
        type: Boolean,
        defaultValue: true
    },
    skillsNeeded: {
        type: Array,
        defaultValue: []
    },
    'skillsNeeded.$': {
        type: String
    },
    skillScoreLow: {
        type: Number,
        min: 0,
        max: 100,
        defaultValue: 90
    },
    skillScoreHigh: {
        type: Number,
        min: 0,
        max: 100,
        defaultValue: 100
    },
    targetCandidateType: {
        type: Number,
        allowedValues: Object.keys(educationLevelEnums).map(function(k){ return parseInt(educationLevelEnums[k].enum) }),
        defaultValue: 0
    },
    targetMajor: {
        type: Array,
        defaultValue: []
    },
    workDays: {
        type: Array,
        defaultValue: []
    },
    workHours: {
        type: Array,
        defaultValue: []
    },
    visaSponsorshipAvailable: {
        type: Boolean,
        defaultValue: false
    },

    address: {
        type: Object,
        defaultValue: {}
    },
    "address.street1": {
        type: String,
        defaultValue: ''
    },
    "address.street2": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "address.city": {
        type: String,
        defaultValue: ''
    },
    "address.state": {
        type: String,
        defaultValue: ''
    },
    "address.zip": {
        type: String,
        defaultValue: ''
    },
    "address.timezoneId": {
        type: String,
        defaultValue: ''
    },
    "address.lat": {
        type: String,
        defaultValue: ''
    },
    "address.lng": {
        type: String,
        defaultValue: ''
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) return (new Date());
        },
    },
    updatedAt: {
        type: Date,
        autoValue() {
            if (this.isInsert || this.isUpdate) return (new Date());
        },
    }
});

Hostgigs.attachSchema(Hostgigs.schema);

export default Hostgigs;
