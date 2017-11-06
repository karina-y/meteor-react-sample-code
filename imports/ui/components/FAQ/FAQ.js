/*
created by: karina
created date: 10/23/17
*/

import React from 'react';
import WhiteBoxBody from "../Shared/Wrappers/WhiteBoxBody";
import {Panel, PanelGroup} from "react-bootstrap";
import './FAQ.less';
import WhoAreYou from "../Shared/WhoAreYou";

class FAQ extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultTo: props.match.params.userType
        };
    }

    render() {

        const companyPanel =  <PanelGroup className="company">
            <Panel collapsible header="How often do I need to host Betagigs?" eventKey="1">
                As often as suits your needs. Some hosts offer Betagigs as part of a focused recruitment process while others use the marketplace frequently to build candidate pipelines and bolster their employer branding.
            </Panel>

            <Panel collapsible header="How much does it cost?" eventKey="2">
                Unlimited use of the Betagig marketplace is completely free. Upon making a hire, the host is charged a predetermined portion of first year annual starting salary. This ranges from 3-15% and still remains less than a traditional recruiting fee.
            </Panel>

            <Panel collapsible header="What are my liabilities?" eventKey="3">
                Job shadowing is most similar to the status an interviewing candidate carries while on the premises. They are not employees, contractors, or interns and do not carry the status or regulations associated thereof. However, it is expected that companies take reasonable precautions to create a safe environment for shadowers during their visit. If you need more information about this topic, please email support@betagig.tech with any legal questions.
            </Panel>

            <Panel collapsible header="Are my shadowers producing work product?" eventKey="4">
                Betagigs are not intended to produce actual work product for the company but to provide a sense of their skillset. In turn, candidates are able to asses their desire to join the company. Betagig experiences are at will and may be terminated by either Party at any point. Host may offer or shadowers may request direct, hands-on experience(s) but either Party may decline to participate.
            </Panel>

            <Panel collapsible header="Can you help me structure my Betagig?" eventKey="5">
                Yes! The Betagig team can help you craft your Betagig to get the most out of your day. Our experienced team can produce a framework for pertinent tasks and a template for sparking conversation.
            </Panel>

            <Panel collapsible header="What about NDAs and CIAAs?" eventKey="6">
                These types of documents and more are seamlessly handled inside your company dashboard.  Simply upload the pertinent documents which are distributed upon an accepted Betagig. They are electronically signed and stored in your dashboard.
            </Panel>
        </PanelGroup>;

        const candidatePanel =  <PanelGroup className="candidate">
            <Panel collapsible header="How much does it cost?" eventKey="1">
                Unlimited Betagigs are totally free. Some users are required to pay an onboarding fee to cover the costs of background checks. This is a one-time service charge.
            </Panel>

            <Panel collapsible header="Why do people participate in Betagigs?" eventKey="2">
                People use Betagigs to explore potentially employers, workplaces and to contrast their skills against people in the workplace. Betagig is the best way for candidates to try their next perspective career move before the buy it.
            </Panel>

            <Panel collapsible header="How do I make a request?" eventKey="3">
                Betagigs available to you will appear in your user dashboard. You are able to submit a request and include relevant experience, skills and a snapshot video in your submission.
            </Panel>

            <Panel collapsible header="How often do I need to participate?" eventKey="4">
                Unlimited use of the Betagig marketplace is completely free. You are able to participate as frequently as you choose.
            </Panel>

            <Panel collapsible header="How many Betagigs can I request at a time?" eventKey="5">
                You may have up to three (3) pending Betagigs at a time. The amount of upcoming Betagigs is unlimited.
            </Panel>

            <Panel collapsible header="Am I producing work product?" eventKey="6">
                Shadowers are able to participate in simulations of the work environment but are not producing work product. For issues regarding dissemination of information and ownership of ideas generated during a Betagig, please review the documents associated with that specific Betagig.
            </Panel>
        </PanelGroup>;

        return (
            <WhiteBoxBody size="lg" additionalOuterClasses="faq-container">

                <WhoAreYou allowDualSelection={true}
                           candidateTitle="Candidate FAQs"
                           companyTitle="Company FAQs"
                           candidatePanel={candidatePanel}
                           companyPanel={companyPanel}
                           defaultTo={this.state.defaultTo} />

                {/* general */}
                <PanelGroup >
                    <Panel collapsible header="Who is Betagig? " eventKey="1">
                        Betagig is a job shadowing marketplace changing the hiring process through real human connection. We pair talented job seekers with exciting companies for a Betagig. Candidates and employers get a chance to evaluate each other in real time during a realistic job preview. It’s the first ever try-before-you-buy for careers.
                    </Panel>

                    <Panel collapsible header="What is a Betagig?" eventKey="2">
                        Betagigs are designed to update legacy recruiting practices by providing two-way realistic job previews for both candidate and employer. Over the course of a day on-site, companies audition qualified candidates in the role they’re meant to fill.
                    </Panel>

                    <Panel collapsible header="How does it work?" eventKey="3">
                        Hosts post available Betagigs to our marketplace with the option to add job descriptions, office photos, and even a 30-second video pitch. Candidates that qualify based on host criteria are then able to request to shadow the role. Hosts are able to review the candidate's profile and request video before accepting or declining the request.
                    </Panel>

                    <Panel collapsible header="What is the duration of a Betagig?" eventKey="4">
                        Betagigs are between three (3) hours and five (5) days in duration. The duration is established by mutual consent between shadower and host. Betagig experiences are at will and may be terminated by either Party at any point.
                    </Panel>
                </PanelGroup>

            </WhiteBoxBody>
        );
    }
}


export default FAQ;
