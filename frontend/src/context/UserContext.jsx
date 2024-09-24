import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {

    const [token, setToken] = useState(localStorage.getItem("libraryToken"));
    

    return (
        <UserContext.Provider value={[token, setToken]}>
            {props.children}
        </UserContext.Provider>
    )
}