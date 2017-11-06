import React from 'react';
import './Index.less';
import { Grid,
    Row,
    Col }
    from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FullWidthBody from "../../components/Shared/Wrappers/FullWidthBody";

const Index = () => (
    <FullWidthBody>

            <div className="index">

                {/* hero image */}
                <Row className="hero-image revamp">
                    <Grid>

                        <div className="vertical-center-outer-block">
                            <div className="vertical-center-inner-block">

                                {/* hero text */}
                                <Row>
                                    <Col xs={12}>
                                        <div className="hero-text">
                                            <h1 className="hero-title">BETA TEST YOUR NEXT JOB</h1>
                                            <span className="hero-tagline">Join our innovative platform and take the work out of finding your next job</span>
                                        </div>
                                    </Col>
                                </Row>

                                {/* sign up form */}
                                <Row className="hero-sign-up">
                                    <Col xs={12}>
                                        <div className="sign-up">
                                            <Link to="/user-signup" className="btn btn-bg-hero btn-wide">Sign Up</Link>
                                        </div>
                                    </Col>
                                </Row>

                            </div>
                        </div>

                    </Grid>
                </Row>

                {/* logo and sign up */}
                <Row className="match-talent">
                    <Grid>
                        <div className="vertical-center-outer-sm">
                            <Col sm={6} className="vertical-center-inner-sm">
                                <div className="betagig-logo">
                                    <img src="/images/sitewide/betagig-logos/Color/betagig-with-heart.png" className="img-responsive" />
                                </div>
                            </Col>

                            <Col sm={6} className="vertical-center-inner-sm">
                                <div className="description">
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12}>
                                                <h1>Matching top talent with great companies.</h1>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12}>
                                                <p>
                                                    Create a profile. Speak with our team. Apply to interesting jobs and receive interview invitations from great
                                                    companies. Our Experiential Hiring Process helps end your job search in no time.
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12}>
                                                <Link to="/user-signup" className="btn btn-bg-purple btn-fat btn-wide">SIGN UP</Link>
                                            </Col>
                                        </Row>
                                    </Grid>

                                </div>
                            </Col>
                        </div>
                    </Grid>
                </Row>

                {/* need to hire top talent */}
                <Row className="hire-talent">
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <h1 className="title-text">Need to hire top talent?</h1>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={8} smPush={2}>
                                <p className="title-subtext">
                                    Betagig's Talent are thorougly screened and are actively
                                    looking for new positions, ensuring you find the right candidate for the job quickly and at a low cost.
                                </p>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Grid fluid className="no-padding">
                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <p className="detail-icon">
                                                <i className="fa fa-hand-spock-o"></i>
                                            </p>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <h2 className="detail-title no-margin">
                                                RECRUIT THE BEST
                                            </h2>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <p className="detail-subtext">
                                                <span>Qualified Candidates </span>
                                                <span>Diverse Talent </span>
                                                <span>Innovative Sourcing</span>
                                            </p>
                                        </Col>
                                    </Row>

                                </Grid>
                            </Col>

                            <Col md={4}>
                                <Grid fluid className="no-padding">
                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <p className="detail-icon">
                                                <i className="fa fa-cog fa-spin"></i>
                                            </p>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <h2 className="detail-title no-margin">
                                                EXPERIENTIAL HIRING
                                            </h2>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <p className="detail-subtext">
                                                <span>Ensure Culture Fit</span>
                                                <span>Test Soft Skills </span>
                                                <span>Realistic Job Preview </span>
                                            </p>
                                        </Col>
                                    </Row>

                                </Grid>
                            </Col>

                            <Col md={4}>
                                <Grid fluid className="no-padding">
                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <p className="detail-icon">
                                                <i className="fa fa-thumbs-o-up"></i>
                                            </p>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <h2 className="detail-title no-margin">
                                                EASY TO USE PLATFORM
                                            </h2>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} className="no-padding">
                                            <p className="detail-subtext">
                                                <span>Effortless Scheduling</span>
                                                <span>Securely Send Documents</span>
                                                <span>Live Customer Support</span>
                                            </p>
                                        </Col>
                                    </Row>

                                </Grid>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <div className="hire-button">
                                    <Link to="/learn-more/company" className="btn btn-bg-purple-invert-no-hover btn-fat btn-wide">I WANT TO HIRE THE BEST</Link>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Row>

                {/* in the news */}
                <Row className="in-the-news">
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <h1 className="title-text">In the News</h1>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <a href="http://www.builtinla.com/blog/betagig-becomes-leading-job-shadowing-platform-los-angeles" target="_blank">
                                    <img src="/images/index/built-in-la.jpg" />
                                </a>
                            </Col>

                            <Col sm={4}>
                                <a href="https://startupleague.online/women-entrepreneurs-startup-league/" target="_blank">
                                    <img src="/images/index/startup-league.jpg" />
                                </a>
                            </Col>

                            <Col sm={4}>
                                <a href="https://soundcloud.com/kym-mcnicholas-on-innovation/integration-market-disruption-a-job-shadow-revolution-a-healthier-track-for-diabetes-patients" target="_blank">
                                    <img src="/images/index/wallstreet.png" />
                                </a>
                            </Col>
                        </Row>
                    </Grid>
                </Row>

            </div>

    </FullWidthBody>
);

export default Index;
