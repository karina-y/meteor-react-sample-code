import React from 'react';
import {Grid, Col, Row, Image} from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import FullWidthBody from "../Shared/Wrappers/FullWidthBody";
import './LearnMore.less';
import UserEnums from '../../../api/Users/enums';
import HeroBanner from "../Shared/HeroBanner";
import ContactForm from "../Shared/ContactForm";
import {Link} from "react-router-dom";
import TwoColumnContent from "../Shared/TwoColumnContent";

const userRoles = UserEnums.USER_ROLE_ENUM;

class LearnMore extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userRole: props.match.params.userType
        }
    }

    render() {
        let submitted = this.state.submitted;

        //default to company content
        let heroBanner = "/images/learn-more/company/hero-banner.jpeg";
        let heroTitle = "BETA TEST YOUR NEXT HIRE";
        let heroTagline = null;
        let heroButtonText = "Sign Up";

        let quickInfoOne = "Everybody's different. Trees are different. Let them all be individuals. We might as well make some Almighty mountains today as well, what the heck. A tree needs to be your friend if you're going to paint him. Be brave. Just take out whatever you don't want. It'll change your entire perspective. There isn't a rule. You just practice and find out which way works best for you.";
        let quickInfoTwo = "These things happen automatically. All you have to do is just let them happen. When you do it your way you can go anywhere you choose. Here we're limited by the time we have. You don't want to kill all your dark areas they are very important. It's a super day, so why not make a beautiful sky? All kinds of happy little splashes.";

        let panelOneImage = "/images/learn-more/company/experiential-hiring.png";
        let panelOneTitle = "What is Experiential Hiring?";
        let panelOneText = <p>Experiential Hiring is a try-before-you-buy interview process that allows both the candidate and the company to get a test drive of working together for a day.</p>;

        let panelTwoImage = "/images/learn-more/company/qualified-candidates.jpg";
        let panelTwoTitle = "Qualified Candidates";
        let panelTwoText = <p>We have hundreds of qualified candidates who are pre-screened and vetted. They are ready for you to invite them to apply.</p>;

        let panelThreeImage = "/images/learn-more/company/create-a-job.png";
        let panelThreeTitle = "Post a Job with Ease";
        let panelThreeText = <p>Onboarding is a quick, seamless process and you can post jobs in no time. Enter some basic information and you're done. Post as many jobs as you like.</p>;

        let panelFourImage = "/images/learn-more/company/browse-candidates.png";
        let panelFourTitle = "Receive requests from pre-qualified candidates or do some browsing on your own.";
        let panelFourText = <p>You can easily see where current candidates are in your hiring process, view new applicants or simply browse through new talent to find the perfect fit. Filter through candidates with options such as years of experience, location, or role type.</p>;

        let panelFiveImage = "/images/learn-more/company/scheduling.jpg";
        let panelFiveTitle = "Set up Phone Screens or Onsite Test Drives of candidates through the platform.";
        let panelFiveText = <p>Google Calendar integration enables Onsite Test Drives and Phone Screens to automatically schedule into your calendar. Give the candidate insight into what the day will consist of and how they should dress so you can get the most out of your day.</p>;

        let finalNote = "Best part? It’s 100% free to use the platform -- you only pay if you hire!";

        //if they're looking at candidate content, change it here
		//awaiting content from marketing - ky
        if (this.state.userRole === userRoles.candidate) {
            heroTitle = "LOREM IPSUM LATIN LATIN LATIN CANDIDATE";
            heroTagline = "hey there i'm a super engaging tagline, listen to me and all will be well";
            heroButtonText = "Sign Up";

            quickInfoOne = "Everybody's different. Trees are different. Let them all be individuals. We might as well make some Almighty mountains today as well, what the heck. A tree needs to be your friend if you're going to paint him. Be brave. Just take out whatever you don't want. It'll change your entire perspective. There isn't a rule. You just practice and find out which way works best for you.";
            quickInfoTwo = "These things happen automatically. All you have to do is just let them happen. When you do it your way you can go anywhere you choose. Here we're limited by the time we have. You don't want to kill all your dark areas they are very important. It's a super day, so why not make a beautiful sky? All kinds of happy little splashes.";

            panelOneImage = "http://via.placeholder.com/600x350";
            panelOneTitle = "Imagination is the key to painting. Happy painting, God bless.";
            panelOneText = <p>Use what happens naturally, don't fight it. Trees get lonely too, so we'll give him a little friend. Everyone is going to see things differently - and that's the way it should be. Have fun with it. Don't fiddle with it all day. You don't have to spend all your time thinking about what you're doing, you just let it happen.</p>;

            panelTwoImage = "http://via.placeholder.com/600x350";
            panelTwoTitle = "Imagination is the key to painting. Happy painting, God bless.";
            panelTwoText = <p>Use what happens naturally, don't fight it. Trees get lonely too, so we'll give him a little friend. Everyone is going to see things differently - and that's the way it should be. Have fun with it. Don't fiddle with it all day. You don't have to spend all your time thinking about what you're doing, you just let it happen.</p>;

            panelThreeImage = "http://via.placeholder.com/600x350";
            panelThreeTitle = "Imagination is the key to painting. Happy painting, God bless.";
            panelThreeText = <p>Use what happens naturally, don't fight it. Trees get lonely too, so we'll give him a little friend. Everyone is going to see things differently - and that's the way it should be. Have fun with it. Don't fiddle with it all day. You don't have to spend all your time thinking about what you're doing, you just let it happen.</p>;

            panelFourImage = "http://via.placeholder.com/600x350";
            panelFourTitle = "Imagination is the key to painting. Happy painting, God bless.";
            panelFourText = <p>Use what happens naturally, don't fight it. Trees get lonely too, so we'll give him a little friend. Everyone is going to see things differently - and that's the way it should be. Have fun with it. Don't fiddle with it all day. You don't have to spend all your time thinking about what you're doing, you just let it happen.</p>;

            finalNote = "Best part is… it’s 100% free to use the platform, you only pay if you hire";
        }
        

        return (
            <FullWidthBody size="lg" additionalOuterClasses="company-get-info">

                {/* hero banner here */}
                <HeroBanner title={heroTitle} buttonText={heroButtonText} banner={heroBanner} />

                <Grid>

                    {/* panel one */}
                    {/* image left, text right */}
                    <TwoColumnContent title={panelOneTitle}
                                      paragraph={panelOneText}
                                      imagePosition="left"
                                      image={panelOneImage} />

                    <hr/>

                    {/* panel two */}
                    {/* text left, image right */}
                    <TwoColumnContent title={panelTwoTitle}
                                      paragraph={panelTwoText}
                                      imagePosition="right"
                                      image={panelTwoImage} />

                    <hr/>

                    {/* panel three */}
                    {/* image left, text right */}
                    <TwoColumnContent title={panelThreeTitle}
                                      paragraph={panelThreeText}
                                      imagePosition="left"
                                      image={panelThreeImage} />

                    <hr/>

                    {/* panel four */}
                    {/* text left, image right */}
                    <TwoColumnContent title={panelFourTitle}
                                      paragraph={panelFourText}
                                      imagePosition="right"
                                      image={panelFourImage} />

                    <hr/>

                    {/* panel four */}
                    {/* text left, image right */}
                    {/* image left, text right */}
                    <TwoColumnContent title={panelFiveTitle}
                                      paragraph={panelFiveText}
                                      imagePosition="left"
                                      image={panelFiveImage} />

                    <hr/>

                    <Row>
                        <Col xs={12}>
                            <h2>{finalNote}</h2>
                        </Col>
                    </Row>

                    <Row style={{textAlign: 'center'}}>
                        <Col xs={12}>
                            <div className="sign-up" style={{marginTop: '20px', marginBottom: '20px'}}>
                                <Link to="/company-signup" className="btn btn-bg-purple btn-fat btn-wide">Sign Up</Link>
                            </div>
                        </Col>
                    </Row>

                    <hr/>


                    {/* contact form */}
                    <ContactForm userRole={this.state.userRole}/>


                </Grid>

            </FullWidthBody>
        );
    }
}

export default LearnMore;
