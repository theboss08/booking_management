import React from 'react';
import Modal2 from './Modal2';

function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

export default function Book2(props) {

    if (props.check_render === "true") return (
        <React.Fragment>
            <div className="book_main">
                <div className="info_book">
                    <label className="avail_info">{props.label_value}</label>
                    <Modal2 id={props.id} name={props.name} email={props.email} phone={props.phone} destination_code={props.destination_code} destination={props.destination} check_in={props.check_in} check_out={props.check_out} guest_count={props.count} amount={((daysBetween(props.check_in, props.check_out) + 1) * props.amount * props.count)} token={props.token} booked_amount={props.booked_amount} />
                </div>
                <div id="amount">Amount : {((daysBetween(props.check_in, props.check_out) + 1) * props.amount * props.count)}</div>
                <div id="avail_list">
                    {props.availability.map((a, key) => <div className="avail_card" key={key}><div className="avail_day">{a.day}</div><div className="avail_month">{a.month}</div><div className="avail">Guest : {a.avail}</div></div>)}
                </div>
            </div>
        </React.Fragment>
    );

    else if(props.check_render === "false") return (
        <React.Fragment>
            <div className="book_main">
                <div className="info_book">
                    <label className="avail_info2">{props.label_value}</label>
                </div>
                <div id="avail_list">
                    {props.availability.map((a, key) => <div className="avail_card" key={key}><div className="avail_day">{a.day}</div><div className="avail_month">{a.month}</div><div className="avail">Guest : {a.avail}</div></div>)}
                </div>
            </div>
        </React.Fragment>
    );
    else return null;
}