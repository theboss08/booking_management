import React from 'react';
import axios from 'axios';
import {loggedIn, loggedOut} from '../actions';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import FullCancel from './FullCancel';
import PartialCancel from './PartialCancel';


// component is responsible for displaying all the bookings of specific user and giving interface for updating and cancelling the booking.
class View extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            redirect : false,
            bookings : [],
        };
    }

    componentDidMount(){
        // if not authenticated go to login route
        if(this.props.user.token === ''){
            this.setState({redirect : true});
        }
        else {

            // request for getting all the bookings
            axios.get('/bookings', {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
                .then(res => {
                    this.setState({bookings : res.data});
                });
        }
    }


    // function for handling full cancellation
    fullCancel(event){
        function treatAsUTC(date) {
            var result = new Date(date);
            result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
            return result;
        }
        
        function daysBetween(startDate, endDate) {
            var millisecondsPerDay = 24 * 60 * 60 * 1000;
            return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
        }
        axios.get('/bookings/' + event.target.name, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
            .then(res => {

                // if the user has paid only 30%
                if(res.data.percentPaid === 30){
                    let today = new Date();
                    today.setDate(today.getDate());

                    // if number of days between today and check in is more than 7 refund full amount with INR 50 processing charge
                    if(parseInt(daysBetween(today, res.data.check_in)) > 7){
                        alert("You will be refunded your full amount.\n With INR 50 processing charge");
                        
                        // request for cancelling the booking
                        axios.delete('/bookings/' + event.target.name, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
                            .then(res => {
                                alert("your booking has been cancelled");
                            })
                    }

                    // if refund nothing
                    else {
                        alert("Your entire amount will be deducted");

                        // request for cancelling the booking
                        axios.delete('/bookings/' + event.target.name, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
                            .then(res => {
                                alert("Your booking has been cancelled");
                            })
                    }
                }
                else {
                    let today = new Date();
                    today.setDate(today.getDate());
                    if(parseInt(daysBetween(today, res.data.check_in)) > 7){
                        alert("You will be refunded your full amount.\n With INR 50 processing charge");
                        axios.delete('/bookings/' + event.target.name, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
                            .then(res => {
                                alert("your booking has been cancelled");
                            })
                    }
                    else {
                        alert("30% of the total amount will be deducted.\n.You will get : " + 0.7 * res.data.amount);
                        axios.delete('/bookings/' + event.target.name, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
                            .then(res => {
                                alert("Your booking has been cancelled");
                            })
                    }
                }
            });
    }



    render() {
        return (
            <div className="view_container">
                {(this.state.redirect === true) ? <Redirect to="/login" /> : ''}
                {this.state.bookings.map((booking, key) => <div key={key}>
                    <div> Name : {booking.name}</div>
                    <div>Email : {booking.email}</div>
                    <div>Phone : {booking.phone}</div>
                    <div>Destination : {booking.destination_name}</div>
                    <div>Check In : {booking.check_in}</div>
                    <div>Check Out{booking.check_out}</div>
                    <div>Guest Count : {booking.guest_count}</div>
                    <div>Total Amount : {booking.amount}</div>
                    <div>Paid Amount : {booking.amount * (booking.percentPaid / 100)}</div>
                    <Link to={"/update/" + booking.code}>UPDATE</Link>
                    {/* <button name={booking.code} onClick={this.fullCancel.bind(this)}>Cancel</button>
                    <button>Partial Cancellation</button> */}

                    {/* component for handling full cancel */}
                    <FullCancel className="full_cancel" id={key} booking_id={booking.code} check_in={booking.check_in} percentPaid={booking.percentPaid} amount={booking.amount} />

                    {/* component for handling partial cancelling */}
                    <PartialCancel className="part_cancel" id={key} name={booking.name} email={booking.email} phone={booking.phone} booking_id={booking.code} guest_count={booking.guest_count} percentPaid={booking.percentPaid} amount={booking.amount} check_out={booking.check_out} check_in={booking.check_in} destination={booking.destination_code}  />
                </div>)}
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps())(View);