/*
created by: karina
created date: 10/31/17
*/

import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import Loading from '../../components/Loading/Loading';
import { Session } from 'meteor/session'
import Social from "../../components/Social/Social";

const renderSocial = ({ loading,
                          instagramFeed,
                          twitterFeed }) =>
    (!loading ? (
        <Social instagramFeed={instagramFeed} twitterFeed={twitterFeed} />
    ) : <Loading />);

renderSocial.propTypes = {
    loading: PropTypes.bool.isRequired,
    instagramFeed: PropTypes.array.isRequired,
    twitterFeed: PropTypes.array.isRequired
};

export default createContainer((props) => {
    let loadingConditional = true;
    let instagramLoaded = false;
    let twitterLoaded = false;
    let twitterFeed;
    let instagramFeed;


    Meteor.call('externalCallsController.getInstagramFeed', function(err, response) {
       if (err) {

       }
       else {
           Session.set('instagramFeed', response.data);
       }

       Session.set('instagramCallCompleted', "yes");
    });

    Meteor.call('externalCallsController.getTwitterFeed', function(err, response) {
        if (err) {

        }
        else {
            Session.set('twitterFeed', response.data);
        }

        Session.set('twitterCallCompleted', "yes");
    });


    //truthy falsey gets weird here so i'm using strings instead
    instagramLoaded = Session.get('instagramCallCompleted') === "yes" ? true : false;
    twitterLoaded = Session.get('twitterCallCompleted') === "yes" ? true : false;

    instagramFeed = Session.get('instagramFeed') == null ? [] : Session.get('instagramFeed');
    twitterFeed = Session.get('twitterFeed') == null ? [] : Session.get('twitterFeed');

    loadingConditional = !instagramLoaded || !twitterLoaded;

    return {
        loading: loadingConditional,
        instagramFeed: instagramFeed,
        twitterFeed: twitterFeed
    };

}, renderSocial);
