import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import Gig from '../../Hostgigs/Gig';


class BrowseViewListPanel extends React.Component {
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

            <div className="scroll-card-container">
                {
                    this.props.filteredCardItems.length

                        ?

                        this.props.children

                        : <Alert bsStyle="warning">{this.props.warningMessage}</Alert>
                }
                {
                    this.props.numShowing < this.props.filteredCardItems.length

                        ?

                        <div className="show-more-btn-container">
                            <Button className="btn-bg-purple" onClick={this.props.showMore} block>Show More</Button>
                        </div>

                        :

                        null

                }
            </div>

        )
    }
}

BrowseViewListPanel.propTypes = {
    showItem: PropTypes.string,
    cardRowDiv: PropTypes.object,
    filteredCardItems: PropTypes.array,
    numShowing: PropTypes.number,
    showMore: PropTypes.func,
    warningMessage: PropTypes.string
};

export default BrowseViewListPanel;