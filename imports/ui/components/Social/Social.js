/*
created by: karina
created date: 10/31/17
*/


import React from 'react';
import {Grid, Col, Row, Image} from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import FullWidthBody from "../Shared/Wrappers/FullWidthBody";
import './Social.less';
import HeroBanner from "../Shared/HeroBanner";
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import NullChecks from '../../methods/NullChecks';
import ShadowBox from "../Shared/Wrappers/ShadowBox";

class Social extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            instagramFeed: props.instagramFeed,
            twitterFeed: props.twitterFeed
        }
    }


    render() {
        //function to find any url's in the tweet and place them in an anchor
        const urlRegex = /(https?:\/\/[^\s]+)/g || /(#[a-z\d]+)/g;
        const hashtagRegex = /(#[a-z\d]+)/g;

        const urlify = function(text) {

            //first take care of the links
            let parts = text.split(urlRegex); // re is a matching regular expression

            // +=2 is because it splits at the url, so it'd be like stringstringstkajsdf, URL, stringstringlkjadsf, URL, etc
            for (let i = 1; i < parts.length; i++) {

                //if even, check for hashtag
                if (i % 2 == 0) {
                    parts[i] = parts[i].split(hashtagRegex);

                    for (let j = 1; j < parts[i].length; j += 2) {
                        //get hashtag minus the hash
                        let tag = parts[i][j].substr(1);

                        parts[i][j] = <a key={'link' + j} href={"https://twitter.com/hashtag/" + tag + "?src=hash"}>{parts[i][j]}</a>;
                    }
                }

                else {
                    //if odd, it's a url
                    parts[i] = <a key={'link' + i} href={parts[i]}>{parts[i]}</a>
                }
            }

            return parts;

        };




        let heroBanner = "/images/learn-more/company/hero-banner.jpeg";
        let heroTitle = "GET IN TOUCH!";
        let heroTagline = null;
        // let heroButtonText = "Sign Up";
        const instagramFeed = this.state.instagramFeed;
        const twitterFeed = this.state.twitterFeed;


        const carouselSettings = {
            dots: true,
            infinite: false,
            initialSlide: 0,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            accessibility: true,
            arrows: true,
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        dots: true,
                        infinite: true,
                        slidesToScroll: 3,
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        initialSlide: 2,
                        slidesToScroll: 2,
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToScroll: 1,
                        slidesToShow: 1
                    }
                }

            ]
        };

        //need to do the date
        //links

        return (
            <FullWidthBody size="lg" additionalOuterClasses="social-feed-container">

                {/* hero banner here */}
                <HeroBanner title={heroTitle} banner={heroBanner} />

                <Grid>

                    {/* twitter */}
                    {NullChecks.isNullOrEmptyArray(twitterFeed)
                        ?
                        ''
                        :
                        <div>
                            {/* twitter logo */}
                            <Row>
                                <Col xs={12}>
                                    <Image src="/images/sitewide/social-logos/twitter-bird.png" width={100} className="feed-logo" />
                                </Col>
                            </Row>

                            {/* twitter feed */}
                            <Row className="twitter-feed">
                                <Col xs={12} className="twitter-feed-inner">
                                    <section className="tweets">
                                        {twitterFeed.map((tweet, index) => (
                                            <article data-index={index} key={index} className="tweet-article">

                                                <div className="tweet">
                                                    <div className="EmbeddedTweet-tweet">
                                                        <ShadowBox shadowLevel={2} hoverAction={false} popoutHover={false}>
                                                            <blockquote className="Tweet h-entry js-tweetIdInfo subject expanded is-deciderHtmlWhitespace" data-tweet-id={tweet.id} data-scribe="section:subject">
                                                                <div className="Tweet-header u-cf">
                                                                    <div className="Tweet-brand u-floatRight">
                                                                        <a href={"https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id} data-scribe="element:logo" target="_blank">
                                                                        <span className="FollowButton-bird">
                                                                            <div className="Icon Icon--twitter " aria-label="View on Twitter" title="View on Twitter" role="presentation"></div>
                                                                        </span></a>
                                                                    </div>

                                                                    <div className="TweetAuthor js-inViewportScribingTarget " data-scribe="component:author">
                                                                        <a className="TweetAuthor-link Identity u-linkBlend" data-scribe="element:user_link" href={"https://twitter.com/" + tweet.user.screen_name} aria-label="Betagig (screen name: betagigapp)">
                                                                        <span className="TweetAuthor-avatar Identity-avatar">
                                                                          <img className="Avatar Avatar--edge"
                                                                               data-scribe="element:avatar"
                                                                               data-src-2x={tweet.user.profile_image_url_https}
                                                                               alt=""
                                                                               data-src-1x={tweet.user.profile_image_url_https}
                                                                               src={tweet.user.profile_image_url_https} />
                                                                        </span>
                                                                            <span className="TweetAuthor-name Identity-name customisable-highlight"
                                                                                  title={tweet.user.name}
                                                                                  data-scribe="element:name">{tweet.user.name}</span>

                                                                            {tweet.user.verified
                                                                                ?
                                                                                <span className="TweetAuthor-verifiedBadge" data-scribe="element:verified_badge">
                                                                                <div className="Icon Icon--verified " aria-label="Verified Account" title="Verified Account" role="img"></div>
                                                                                <b className="u-hiddenVisually">✔</b>
                                                                            </span>
                                                                                :
                                                                                ''
                                                                            }

                                                                            <span className="TweetAuthor-screenName Identity-screenName" title={"@" + tweet.user.screen_name} data-scribe="element:screen_name" dir="ltr">@{tweet.user.screen_name}</span>
                                                                        </a>
                                                                    </div>

                                                                </div>
                                                                <div className="Tweet-body e-entry-content" data-scribe="component:tweet">

                                                                    <div className="u-hiddenVisually js-inViewportScribingTarget"></div>

                                                                    <p className="Tweet-text e-entry-title" lang="en" dir="ltr">
                                                                        {urlify(tweet.text)}
                                                                    </p>

                                                                    {/*<p className="Tweet-text e-entry-title" lang="en" dir="ltr">Sunsets don't get much better than this one over <a href="https://twitter.com/GrandTetonNPS" className="PrettyLink profile customisable h-card" dir="ltr" data-mentioned-user-id="44991932" data-scribe="element:mention">
                                                                    <span className="PrettyLink-prefix">@</span>
                                                                    <span className="PrettyLink-value">GrandTetonNPS</span></a>.
                                                                    <a href="https://twitter.com/hashtag/nature?src=hash" data-query-source="hashtag_click" className="PrettyLink hashtag customisable" dir="ltr" rel="tag" data-scribe="element:hashtag">
                                                                        <span className="PrettyLink-prefix">#</span>
                                                                        <span className="PrettyLink-value">nature</span>
                                                                    </a>
                                                                    <a href="https://twitter.com/hashtag/sunset?src=hash" data-query-source="hashtag_click" className="PrettyLink hashtag customisable" dir="ltr" rel="tag" data-scribe="element:hashtag">
                                                                        <span className="PrettyLink-prefix">#</span>
                                                                        <span className="PrettyLink-value">sunset</span>
                                                                    </a>
                                                                    </p>*/}

                                                                    {/*
                                                                    <p className="Tweet-text e-entry-title" lang="en" dir="ltr">
                                                                        {
                                                                            tweet.entities.hashtags.map((hashtag, hashtagIndex) => (
                                                                                <a href={"https://twitter.com/hashtag/" + hashtag.text + "?src=hash"}
                                                                                   data-query-source="hashtag_click"
                                                                                   className="PrettyLink hashtag customisable"
                                                                                   dir="ltr"
                                                                                   rel="tag"
                                                                                   data-scribe="element:hashtag"
                                                                                   target="_blank"
                                                                                   data-index={hashtagIndex}
                                                                                   key={hashtagIndex}>
                                                                                    <span className="PrettyLink-prefix">#</span>
                                                                                    <span className="PrettyLink-value">{hashtag.text}</span>
                                                                                </a>
                                                                            ))
                                                                        }
                                                                    </p>
                                                                    */}

                                                                    <div className="Tweet-metadata dateline">
                                                                        <a className="u-linkBlend u-url customisable-highlight long-permalink" data-datetime="2014-05-05T22:09:42+0000" data-scribe="element:full_timestamp" href={"https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id}>
                                                                            <time className="dt-updated" dateTime="2014-05-05T22:09:42+0000" title="Time posted: May 05, 2014 22:09:42 (UTC)">3:09 PM - May 5, 2014</time>
                                                                            {/*todo time here tweet.created_at*/}
                                                                        </a>
                                                                    </div>


                                                                    {/*todo conditional on these*/}
                                                                    <ul className="Tweet-actions" data-scribe="component:actions" role="menu" aria-label="Tweet actions">
                                                                        <li className="Tweet-action">
                                                                            <a className="TweetAction TweetAction--replyEdge web-intent" href={"https://twitter.com/intent/tweet?in_reply_to=" + tweet.id} data-scribe="element:reply">
                                                                                <div className="Icon Icon--reply TweetAction-icon Icon--replyEdge" aria-label="Reply" title="Reply" role="img"></div>
                                                                                {/*<span className="TweetAction-stat" data-scribe="element:reply_count" aria-hidden="true">925</span>*/}
                                                                                {/*<span className="u-hiddenVisually">925 Replies</span>*/}
                                                                            </a>
                                                                        </li>
                                                                        <li className="Tweet-action">
                                                                            <a className="TweetAction TweetAction--retweetEdge web-intent" href={"https://twitter.com/intent/retweet?tweet_id=" + tweet.id} data-scribe="element:retweet">
                                                                                <div className="Icon Icon--retweet TweetAction-icon Icon--retweetEdge" aria-label="Retweet" title="Retweet" role="img"></div>
                                                                                {/*<span className="TweetAction-stat" data-scribe="element:retweet_count" aria-hidden="true">{tweet.retweet_count}</span>*/}
                                                                                {/*<span className="u-hiddenVisually">{tweet.retweet_count} Retweets</span>*/}
                                                                            </a>
                                                                        </li>
                                                                        <li className="Tweet-action">
                                                                            <a className="TweetAction TweetAction--heartEdge web-intent" href={"https://twitter.com/intent/like?tweet_id=" + tweet.id} data-scribe="element:heart">
                                                                                <div className="Icon Icon--heart TweetAction-icon Icon--heartEdge" aria-label="Like" title="Like" role="img"></div>
                                                                                {/*<span className="TweetAction-stat" data-scribe="element:heart_count" aria-hidden="true">{tweet.favorite_count}</span>*/}
                                                                                {/*<span className="u-hiddenVisually">{tweet.favorite_count} likes</span>*/}
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </blockquote>
                                                        </ShadowBox>
                                                    </div>
                                                </div>

                                            </article>
                                        ))}
                                    </section>
                                </Col>
                            </Row>

                            <hr/>
                        </div>
                    }

                    {/* instagram */}
                    {NullChecks.isNullOrEmptyArray(instagramFeed)
                        ?
                        ''
                        :
                        <div>
                            {/* instagram logo */}
                            <Row>
                                <Col xs={12}>
                                    <Image src="/images/sitewide/social-logos/instagram-text.png" width={200} className="feed-logo" />
                                </Col>
                            </Row>

                            {/* instagram feed */}
                            <Row className="instagram-feed">
                                <Col xs={12}>

                                    <Slider {...carouselSettings}>
                                        {instagramFeed.map((photo, index) => (
                                            <div data-index={index} key={index} className="instagram-image-container">

                                                <a href={photo.link} target="_blank">

                                                    <div className="image-overlay">
                                                        <div className="image-description">
                                                            <p className="caption">{photo.caption.text}</p>
                                                            <span className="likes"><i className="fa fa-heart" aria-hidden="true"></i> {photo.likes.count}</span>
                                                            <span className="comments"><i className="fa fa-comments" aria-hidden="true"></i> {photo.comments.count}</span>
                                                        </div>
                                                    </div>

                                                    <div className="image" style={{background: 'url(' + photo.images.standard_resolution.url + ') no-repeat center center/cover'}}>
                                                    </div>

                                                </a>
                                            </div>
                                        ))}
                                    </Slider>

                                </Col>
                            </Row>

                            <hr/>
                        </div>
                    }

                    <Row>
                        <Col xs={12}>
                            {/*<h2>{finalNote}</h2>*/}
                        </Col>
                    </Row>

                    <hr/>

                    {/* sign up for our newsletter form */}
                    {/* contact form */}
                    {/*<ContactForm userRole={this.state.userRole}/>*/}


                </Grid>

            </FullWidthBody>
        );
    }
}

Social.propTypes = {
    instagramFeed: PropTypes.array.isRequired,
    twitterFeed: PropTypes.array.isRequired
};

export default Social;
