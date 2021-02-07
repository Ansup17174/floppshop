import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

const ConfirmEmail = () => {

    const [isConfirmed, setIsConfirmed] = useState(false);
    const { key } = useParams();

    useEffect(() => {
        const url = "http://localhost:8000/auth/registration/verify-email/";
        axios.post(url, {key: key})
        .then(response => {
            console.log(response.data);
            setIsConfirmed(true);
        })
        .catch(error => {
            console.log(error.response.data);
            setIsConfirmed(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <h1 className="main-text">{isConfirmed ? "E-mail confirmed succesfully" : "Activation link invalid"}</h1>
    );
};

export default ConfirmEmail;