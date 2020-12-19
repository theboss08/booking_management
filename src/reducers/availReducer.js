let states = {
    destination : '',
    check_in : '',
    check_out : '',
    guest_count : '',
};

const availReducer = (state = states, action) => {
    if(action.type === "destination"){
        return {
            ...state,
            destination : action.payload
        }
    }
    else if(action.type === 'check_in'){
        return {
            ...state,
            check_in : action.payload
        }
    }
    else if(action.type === 'check_out'){
        return {
            ...state,
            check_out : action.payload
        }
    }
    else if(action.type === 'guest_count'){
        return {
            ...state,
            guest_count : action.payload
        }
    }
    else {
        return state;
    }
}

export default availReducer;