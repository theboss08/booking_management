const states = {
    name : '',
    email : '',
    phone : '',
    token : '',
};

const userReducer = (state = states, action) => {
    if(action.type === 'loggedIn'){
        return {
            ...state,
            name : action.payload.name,
            email : action.payload.email,
            phone : action.payload.phone,
            token : action.payload.token,
        }
    }
    else if(action.type === 'loggedOut'){
        return {
            ...state,
            name : '',
            email : '',
            phone : '',
            token : '',
        }
    }
    else return state;
}

export default userReducer;