import axios from 'axios';

const getSession = async () => {
    const url = "http://localhost:8000/auth/user/";
    let userData;
    await axios.post(url)
    .then(response => {
        userData = response.data;
    })
    .catch(error => {
        userData = false;
    });
    return userData;
};

export default getSession;