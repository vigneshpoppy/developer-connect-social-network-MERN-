import React from 'react'
import PropTypes from 'prop-types'
import {connect} from "react-redux"
//props ku patghila alerts pass panirukan 
const Alert = ({alerts}) => 
alerts!==null && alerts.length > 0 && alerts.map(alert=>(
    <div key={Alert.id} className={`alert alert-${alert.alertType}`}>
        { alert.msg }

    </div>
));
Alert.propTypes = {
    alerts:PropTypes.func.isRequired,

}

const mapStateToProps=state=>({ // pass redux state to props for component
    alerts:state.alert
});

export default connect(mapStateToProps)(Alert);
