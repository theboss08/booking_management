// export const destination = (dest) => {
//     return {
//         type : 'destination',
//         payload : dest
//     }
// }

// export const check_in = (check_in) => {
//     return {
//         type : 'check_in',
//         payload : check_in
//     }
// }

// export const check_out = (check_out) => {
//     return {
//         type : 'check_out',
//         payload : check_out
//     }
// }

// export const guest_count = (guest_count) => {
//     return {
//         type : 'guest_count',
//         payload : guest_count
//     }
// }

// export const user = (user) => {
//     return {
//         type : 'user',
//         payload : user
//     }
// }


export const destination = (destination) => {
    return {
        type : 'destination',
        payload : destination
    }
}

export const check_in = (check_in) => {
    return {
        type : 'check_in',
        payload : check_in
    }
}

export const check_out = (check_out) => {
    return {
        type : 'check_out',
        payload : check_out
    }
}

export const guest_count = (guest_count) => {
    return {
        type : 'guest_count',
        payload : guest_count
    }
}

export const loggedIn = (user) => {
    console.log(user);
    return {
        type : 'loggedIn',
        payload : user
    }
}

export const loggedOut = () => {
    return {
        type : 'loggedOut',
    }
}
