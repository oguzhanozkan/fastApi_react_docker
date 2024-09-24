import {createContext, useState} from 'react'

export const UserInfoContext = createContext();


export const UserInfoProvider = (props) => {

    const [userId, setUserIdContext] = useState(localStorage.getItem("userId"));

    return (
        <UserInfoContext.Provider value={[userId, setUserIdContext]}>
            {props.children}
        </UserInfoContext.Provider>
    )
}