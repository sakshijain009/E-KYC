import React, { useState } from "react";
import apis from "../../api";
import Spinner from "../Spinner";

export default function SearchKYCForm(props) {
    const [credentials, setCredentials] = useState({
        email: "",
    });

    const [userData, setUserData] = useState(null);
    const [isloading, setisloading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const searchUserWithEmail = async (event, email) => {
        event.preventDefault();
        setisloading(true);

        try {
            let response = await apis.bank
                .getUserDataFromEmail(email)
                .then((res) => res.json());
            console.log(response);
            if (!response.error) {
                setUserData(response);
                setisloading(false);
            } else {
                console.log(response.error);
                setUserData(null);
                setisloading(false);
                alert(response.error);
            }
        } catch (err) {
            console.log(err, " in Getting all records of user in verifier side");
        }
    };

    return (
        <div>
            <div className="text-center sign-in">
                <form className="form-signin">
                    <h1 className="h3 mb-1 font-weight-normal">
                        Search Customer Profile
                    </h1>
                    <input
                        type="email"
                        value={credentials.email}
                        name="email"
                        className="form-control my-3"
                        placeholder="Enter Email..."
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    <button
                        className="btn btn-lg btn-primary btn-block my-3"
                        type="submit"
                        onClick={(event) =>
                            searchUserWithEmail(event, credentials.email)
                        }
                    >
                        Search
                    </button>
                    {isloading && <Spinner />}
                </form>
            </div>

            {userData && (
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">Customer Details</div>
                        <div className="card-body">
                            <h5>
                                {userData.user.name}{" "}
                                <span className="badge bg-success">
                                    {userData.user.email}
                                </span>
                            </h5>
                            <p className="card-text">
                                The details regarding the customer documents is
                                given below.
                            </p>

                            {userData.documents.map((element, i) => {
                                return (
                                    <div
                                        className="container bg-light py-2 px-2 shadow my-3 mx-3"
                                        key={i}
                                    >
                                        <p className="card-text">
                                            <b>Document: </b>
                                            {element.doc_type}
                                        </p>

                                        <p className="card-text">
                                            <b>Filename: </b>
                                            {element.filename}
                                        </p>

                                        <p className="card-text">
                                            <b>Status: </b>
                                            {element.status}
                                        </p>

                                        {element.approved_verifier_id && (
                                            <p className="card-text">
                                                <b>Verifier ID: </b>
                                                {element.approved_verifier_id}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <p className="mt-5 mb-3 text-muted text-center">
                &copy; Wells Fargo
            </p>
        </div>
    );
}
