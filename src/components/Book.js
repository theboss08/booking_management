import React from 'react';
import Modal from './Modal';


// return utc time used by daysBetween function
function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

// for getting the number of days between two dates.
function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}


// functional component for displaying the booking form.
function Book(props) {

    // checking to render or not based on the availability it recieves the check props from check component.
    if (props.check === "true") {
        return (
            <React.Fragment>
                <div className="book_main">
                    <div className="info_book">
                        <label className="avail_info">{props.label_value}</label>

                        {/* Modal for displaying booking form */}
                        <Modal destination_code={props.destination_code} destination={props.destination} check_in={props.check_in} check_out={props.check_out} count={props.count} amount={((daysBetween(props.check_in, props.check_out) + 1) * props.amount * props.count)} />
                    </div>
                    <div id="amount">Amount : {((daysBetween(props.check_in, props.check_out) + 1) * props.amount * props.count)}</div>


                    {/* for displaying the cards */}
                    <div id="avail_list">
                        {props.availability.map((a, key) => <div className="avail_card" key={key}><div className="avail_day">{a.day}</div><div className="avail_month">{a.month}</div><div className="avail">Guest : {a.avail}</div></div>)}
                    </div>
                </div>
            </React.Fragment>
        );
    }
    else if(props.check === "false") return (
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

export default Book;