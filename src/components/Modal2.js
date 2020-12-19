
import React, {useState } from 'react';
import axios from 'axios'
import './style/Modal.css';
import {Redirect} from 'react-router-dom';

function CheckGreater(props){

    const [redirect, setRedirect] = useState(false);

    function handleClick(event){
        axios.put('/bookings/' + props.id, {destination : props.destination_code, name : props.name, email : props.email, phone : props.phone, guest_count : props.guest_count, check_in : props.check_in, check_out : props.check_out, amount : props.amount}, {headers : {'Authorization' : 'Bearer ' + props.token}})
            .then(res => {
                alert("Your booking has been updated");
                setRedirect(true);
            });
    }

    if(props.booked_amount < props.amount){
        return (
            <div>
            {(redirect === true) ? <Redirect to="/" /> : ''}
                You have to pay {props.amount - props.booked_amount} more.
                <div className="confirm_button_container"><button className="confirm_button" onClick={handleClick} >Pay</button></div>
            </div>
        );
    }
    else if(props.booked_amount > props.amount){
        return (
            <div>
                {(redirect === true) ? <Redirect to="/" /> : ''}
                Your current amount is less than the previous amount.
                We will refund you {props.booked_amount - props.amount}
                <div className="confirm_button_container"><button className="confirm_button" onClick={handleClick}>Confirm</button></div>
            </div>
        );
    }
    else return (
        <div>
        {(redirect === true) ? <Redirect to="/" /> : ''}
            Your current amount is exactly equal to your previous amount.
            <div className="confirm_button_container"><button className="confirm_button" onClick={handleClick}>Confirm</button></div>
        </div>
    );
}

export default function Modal(props) {
    return (
        <React.Fragment>
            <div>
                <a id="open" href="#openModal">Book</a>
                <div id="openModal" className="modalDialog">
                    <div>	<a href="#close" title="Close" className="close">X</a>
                    <CheckGreater id={props.id} booked_amount={props.booked_amount} amount={props.amount} destination_code={props.destination_code} check_in={props.check_in} check_out={props.check_out} guest_count={props.guest_count} name={props.name} email={props.email} phone={props.phone} token={props.token}/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}