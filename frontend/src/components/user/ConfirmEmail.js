import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import apiInstance from '../../utils/api';

const ConfirmEmail = () => {

    const [isConfirmed, setIsConfirmed] = useState(false);
    const { key } = useParams();

    useEffect(() => {
        const url = "auth/registration/verify-email/";
        apiInstance.post(url, {key: key})
        .then(response => {
            console.log(response.data);
            setIsConfirmed(true);
        })
        .catch(error => {
            console.log(error.response.data);
            setIsConfirmed(false);
        });
    }, []);

    return (
        <h1 className="main-text">{isConfirmed ? "E-mail confirmed succesfully" : "Activation link invalid"}</h1>
    );
};

export default ConfirmEmail;