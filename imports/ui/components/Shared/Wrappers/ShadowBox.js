/*
created by: karina
created date: 10/14/17
*/


import React from 'react';
import PropTypes from 'prop-types';
import './ShadowBox.less';

class ShadowBox extends React.Component {
    constructor(props) {
        super(props);

        /*  ACCEPTABLE PROP VALUES
            shadowLevel:            0-5
            hoverAction:            true or false   ONLY USE ONE HOVERACTION OR POPOUTHOVER, NEVER BOTH
            popoutHover:            true or false   ONLY USE ONE HOVERACTION OR POPOUTHOVER, NEVER BOTH
            bootstrapColClasses:    meant for any bootstrap column classes (ie col-xs-12 col-md-4 col-lg-push-1 hidden-xs etc)
            additionalOuterClasses: any string
         */

        this.state = {
            shadowLevel: props.shadowLevel,
            hoverAction: props.hoverAction,
            popoutHover: props.popoutHover,
            bootstrapColClasses: props.bootstrapColClasses,
            additionalOuterClasses: props.additionalOuterClasses
        }
    }

    render() {
        let shadowLevel;

        switch(this.props.shadowLevel) {
            case 0:
                shadowLevel = "level-zero";
                break;
            case 1:
                shadowLevel = "level-one";
                break;
            case 2:
                shadowLevel = "level-two";
                break;
            case 3:
                shadowLevel = "level-three";
                break;
            case 4:
                shadowLevel = "level-four";
                break;
            case 5:
                shadowLevel = "level-five";
                break;
            case 6:
                shadowLevel = "level-six";
                break;
            default:
                shadowLevel = "level-zero";
        }

        const additionalOuterClasses = this.props.additionalOuterClasses != null ? this.props.additionalOuterClasses : "";
        const bootstrapColClasses = this.props.bootstrapColClasses != null ? this.props.bootstrapColClasses : "";
        const hoverAction = this.props.hoverAction ? "shadow-hover" : "";
        const popoutHover = this.props.popoutHover ? "popout-hover" : "";

        const outerClassName = "shadow-box " + additionalOuterClasses + " " + shadowLevel + " " + hoverAction + " " + popoutHover;

        return (
            <div className={bootstrapColClasses}>
                <div className={outerClassName}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

ShadowBox.propTypes = {
    shadowLevel: PropTypes.number.isRequired,
    hoverAction: PropTypes.bool.isRequired,
    popoutHover: PropTypes.bool.isRequired,
    additionalOuterClasses: PropTypes.string,
    bootstrapColClasses: PropTypes.string
};

export default ShadowBox;




