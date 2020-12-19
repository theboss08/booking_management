import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Detail(props) {

    function handleClick(e) {
        axios.delete('/bookings/' + props.id)
            .then(res => {
                alert("Your booking has been cancelled.");
                window.location.replace("http://localhost:3000");
            });
    }

    if (props.render === true) {
        return (
            <div className="details_main">
                <div>Name : {props.name}</div>
                <div>Email : {props.email}</div>
                <div>Phone : {props.phone}</div>
                <div>Destination : {props.dest_name}</div>
                <div>No. of guest : {props.guest_count}</div>
                <div>Check In Date : {props.check_in}</div>
                <div>Check Out Date : {props.check_out}</div>
                <div>Amount : {props.amount}</div>
                <div>Booked At : {props.booked_at.slice(0, 19)}</div>
                <div className="view_buttons">
                    <Link to={"/update/" + props.id}>Update</Link>
                    <button onClick={handleClick}>Cancel</button>
                </div>
            </div>
        );
    }
    else return null;
}