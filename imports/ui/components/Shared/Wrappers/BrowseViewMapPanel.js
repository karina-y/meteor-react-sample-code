/*
created by: karina
created date: 10/15/17
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
// import Filters from './Filters';
import { createContainer } from 'meteor/react-meteor-data';
let zipCodes = require('../../../../../zipCodes.json');

class BrowseViewMapPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showItem: props.showItem,
            cardRowDiv: props.cardRowDiv,
            filteredCardItems: props.filteredCardItems,
            numShowing: props.numShowing,
            showMore: props.showMore,
            warningMessage: props.warningMessage
        }
    }

    render() {

        return (

            <Col md={6} className={this.props.showItem + " right-panel full-height"}>
                <div style={{border:'0px'}} className="right-panel-content full-height">
                    {this.props.children}
                </div>
            </Col>
        )
    }
}

BrowseViewMapPanel.propTypes = {
    showItem: PropTypes.string,
    cardRowDiv: PropTypes.object,
    filteredCardItems: PropTypes.array,
    numShowing: PropTypes.number,
    showMore: PropTypes.number,
    warningMessage: PropTypes.string
};

export default BrowseViewMapPanel;