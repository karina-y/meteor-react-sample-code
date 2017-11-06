import React from 'react';
import PropTypes from 'prop-types';
import "./FullWidthBody.less";


class FullWidthBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            compensateNav: Meteor.user() ? "compensate-dual-nav" : "compensate-single-nav",
            additionalOuterClasses: props.additionalOuterClasses
        }
    }

    render() {
        const additionalOuterClasses = this.props.additionalOuterClasses != null ? this.props.additionalOuterClasses : "";

        const outerClassName = "full-width-page " + this.state.compensateNav + " " + additionalOuterClasses;

        return (
            <div className={outerClassName}>
                {this.props.children}
            </div>
        )
    }
}

FullWidthBody.propTypes = {
    additionalOuterClasses: PropTypes.string
};

export default FullWidthBody;




