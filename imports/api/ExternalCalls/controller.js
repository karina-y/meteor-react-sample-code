import { Meteor } from 'meteor/meteor';
import rateLimit from '../../modules/rate-limit';
const Twitter = require('twitter');
const TwitterEnvVars = Meteor.settings.private.TWITTER;

Meteor.methods({

    'externalCallsController.getInstagramFeed': function getInstagramFeed(){
        let ret = {
            'title': 'Success! ',
            'message': "You've received your instagram feed!",
            'type': 'success',
            'data': []
        };

        try {
            const response = HTTP.call( 'get', 'https://api.instagram.com/v1/users/self/media/recent/?access_token=OMITTED');

            if (response.statusCode == 200 && response.data && response.data.data) {
                ret.data = response.data.data;
            }
            else {
                throw new Meteor.ValidationError(['500', response.statusCode]);
            }

            return ret;
        }

        catch(exception) {
            throw new Meteor.ValidationError(['500', exception.message]);
        }

    },

    'externalCallsController.getTwitterFeed': function getTwitterFeed() {
        let ret = {
            'title': 'Success! ',
            'message': "You've received your instagram feed!",
            'type': 'success',
            'data': []
        };

        try {
            const client = new Twitter({
                consumer_key: TwitterEnvVars.TWITTER_CONSUMER_KEY,
                consumer_secret: TwitterEnvVars.TWITTER_CONSUMER_SECRET,
                access_token_key: TwitterEnvVars.TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: TwitterEnvVars.TWITTER_ACCESS_TOKEN_SECRET
            });

            const params = {screen_name: 'betagigapp'};

            let response = client.get('statuses/user_timeline', params)
                .then(function (tweets) {
                    ret.data = tweets;
                    return ret;
                })
                .catch(function (error) {
                    throw error;
                });

            return response;

        }
        catch (exception) {
            throw new Meteor.ValidationError(['500', exception.message]);
        }
    }

});


rateLimit({
    methods: [
        'externalCallsController.getInstagramFeed',
        'externalCallsController.getTwitterFeed'
    ],
    limit: 5,
    timeRange: 1000,
});