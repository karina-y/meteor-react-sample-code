/*
created by: karina
created date: 9/23/17
*/

const HostgigEnums = { };

const HOSTGIG_STATUS_ENUM = {
    'none' : {'enum': 0, 'displayName': 'None'},
    'allJobPostings' : {'enum': 1, 'displayName': 'All Job Postings'},
    'createJobPosting' : {'enum': 2, 'displayName': 'Create a Job Posting'},
    'expiringJobPostings' : {'enum': 3, 'displayName': 'Expiring Soon'},
    'archivedJobPostings' : {'enum': 4, 'displayName': 'Archived Job Postings'}
};

HostgigEnums.HOSTGIG_STATUS_ENUM = HOSTGIG_STATUS_ENUM;

export default HostgigEnums;
