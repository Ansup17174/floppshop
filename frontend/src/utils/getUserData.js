import axios from 'axios';


const getUserData = async () => {
    const url = "http://localhost:8000/auth/user/";
    let response = await axios.get(url , {withCredentials: true});
    return response;
};

export default getUserData;