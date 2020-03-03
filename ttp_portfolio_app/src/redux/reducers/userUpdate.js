const initialState = {
    loginStatus:false
}

const userUpdateReducer = (state = initialState, action) => {
    switch (action.type) {
        //If we have time, implement a cleaner way to log out
        case "USER_UPDATE_LOGIN_STATUS":
            return {
                ...state,
                loginStatus: !state.loginStatus
            }
        case "USER_UPDATE_BASIC_INFO":
            return {
                ...state,
                info: action.payload
            }
        case "USER_UPDATE_BALANCE":
            return {
                ...state,
                balance: action.payload
            }
        case "USER_UPDATE_PORTFOLIO":
            state["portfolio"] = action.payload;
            return {
                ...state,
                portfolio: action.payload
            }
        case "USER_UPDATE_TRANSACTIONS":
            return {
                ...state,
                transactions: action.payload
            }
        default:
            return state;
    }
}

export default userUpdateReducer;