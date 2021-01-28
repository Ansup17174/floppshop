import {useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';

const UserProfile = () => {

    const {userData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (userData.pk) {
            return;
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <div>
            <div>{userData.pk}</div>
            <div>{userData.email}</div>
            <div>{userData.first_name}</div>
        </div>
    );
};

export default UserProfile;