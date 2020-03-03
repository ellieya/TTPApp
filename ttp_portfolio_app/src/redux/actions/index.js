export const userUpdateLoginStatus = (status) => {
    return {
        type: "USER_UPDATE_LOGIN_STATUS",
        payload: status
    }
}

export const userUpdateBasicInformation = (info) => {
    return {
        type: "USER_UPDATE_BASIC_INFO",
        payload: info
    }
}

export const userUpdateBalance = (balance) => {
    return {
        type: "USER_UPDATE_BALANCE",
        payload: balance
    }
}

export const userUpdatePortfolio = (portfolio) => {
    return {
        type: "USER_UPDATE_PORTFOLIO",
        payload: portfolio
    }
}

export const userUpdateTransactions = (transactions) => {
    return {
        type: "USER_UPDATE_TRANSACTIONS",
        payload: transactions
    }
}