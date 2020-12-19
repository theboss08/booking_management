import axios from 'axios';
import React from 'react';
import './style/Modal.css';
import { loggedIn, loggedOut} from '../actions';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';


// component for handling full cancelling
class FullCancel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            details : '',
            amount : 0,
            redirect : false,
        };
    }

    handleClick(event){
        event.preventDefault();
        // Request for deleting the account.
        axios.delete('/bookings/' + this.props.booking_id, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
                            .then(res => {
                                alert("Your booking has been cancelled");
                                this.setState({redirect : true});
                            })
    }

    componentDidMount(){
        function treatAsUTC(date) {
            var result = new Date(date);
            result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
            return result;
        }
        
        function daysBetween(startDate, endDate) {
            var millisecondsPerDay = 24 * 60 * 60 * 1000;
            return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
        }
        let today = new Date();
        today.setDate(today.getDate());

        // setting the algorithm for deduction according to the policy provided
        if(this.props.percentPaid === 30){
            if(parseInt(daysBetween(today, this.props.check_in)) > 7){
                this.setState({details : "Your full amount will be refunded deducting INR 50 for processing charge\n.", amount : this.props.amount * 0.3 - 50});
            }
            else {
                this.setState({details : "Your full amount will be deducted", amount : 0});
            }
        }
        else {
            if(parseInt(daysBetween(today, this.props.check_in)) > 7){
                this.setState({details : "Your full amount will be refunded deducting INR 50 for processing charge", amount : this.props.amount - 50});
            }
            else {
                this.setState({details : 'Your 30% amount will be deducted', amount : 0.7 * this.props.amount});
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="full_cancel">
                    <a id="open" href={"#openModal" + this.props.id}>Cancel</a>

                    <div id={"openModal" + this.props.id} className="modalDialog">
                        <div>
                            <a href="#close" title="Close" className="close">X</a>
                            <div>
                            {this.state.details}
                            </div>
                            <div>
                                You will be refunded : {this.state.amount}
                            </div>
                            <button onClick={this.handleClick.bind(this)}>Confirm</button>
                        </div>
                    </div>
                </div>
                {(this.state.redirect === true) ? <Redirect to="/" /> : ''}
            </React.Fragment>
        );
    }
}


// connecting redux to react.
const mapStateToProps = (state) => {
    return{
        user : state.userReducer,
    }
}

const mapDispatchToProps = () => {
    return {
        loggedIn, loggedOut
    }
}
export default connect(mapStateToProps, mapDispatchToProps())(FullCancel);