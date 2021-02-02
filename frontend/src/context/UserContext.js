import {createContext} from 'react';

const UserContext = createContext({
    userData: {},
    setUserData: (data) => {}
});

export default UserContext;