import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import Employees from '../Employees/Employees';
import Hostgigs from '../Hostgigs/Hostgigs';

const Companies = new Mongo.Collection('Companies');
Companies.helpers({
    employees() {
        //console.log("Searching employees for this id: ",this._id);
        return Employees.find(
            { companyId: this._id }
        )
    },
    hostgigs() {
        return Hostgigs.find(
            { companyId: this._id }
        )
    }
});

Companies.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Companies.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

Companies.schema = new SimpleSchema({
    companyName: {
        type: String,
        defaultValue: ''
    },
    pitchVideo: {
        type: String,
        defaultValue: '',
        optional: true
    },
    website: {
        type: String,
        defaultValue: ''
    },

    //agreements all candidates need to agree to for gigs
    universalAgreements: {
        type: Array,
        defaultValue: []
    },

    generalGigDocuments: {
        type: Array,
        defaultValue: []
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

    photos: {
        type: Object,
        defaultValue: {}
    },
    "photos.companyLogo": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "photos.profilePhotos": {
        type: Array,
        defaultValue: [],
        optional: true
    },
    'photos.profilePhotos.$': {
        type: String
    },
    "photos.mainProfilePhoto": {
        type: String,
        defaultValue: '',
        optional: true
    },
    details: {
        type: Object,
        defaultValue: {}
    },
    "details.benefits": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "details.tagLine": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "details.description": {
        type: String,
        defaultValue: ''
    },
    "details.culture": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "details.companySize": {
        type: String,
        defaultValue: ''
    },
    "details.coreValues": {
        type: Array,
        defaultValue: [],
        optional: true
    },
    "details.funFact": {
        type: String,
        defaultValue: '',
        optional: true
    },
    "details.industry": {
        type: Number,
        defaultValue: 0,
        optional: true
    },

    isVisible:  {
        type: Boolean,
        defaultValue: true
    },
    isDeleted:  {
        type: Boolean,
        defaultValue: false
    },
    completedSignUpSteps: {
        type: Array,
        defaultValue: []
    },
    'completedSignUpSteps.$': {
        type: Number
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
            if (this.isInsert) return (new Date());
        },
    },
});

Companies.attachSchema(Companies.schema);

export default Companies;
