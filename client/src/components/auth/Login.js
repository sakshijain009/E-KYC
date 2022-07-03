import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import profile from "../assets/profile.png";

export default function Login() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [alertdata, setalertdata] = useState({
        alertType: "primary",
        alertMessage: "Enter Login Details",
    });

    // navigate to some page
    const navigate = useNavigate();

    // handle change function
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5001/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        });

        const json = await response.json();

        if (json.success) {
            // save the auth token and redirect
            localStorage.setItem("token", json.token);
            let decoded = jwt_decode(json.token);
            if (decoded.usertype === "Customer") {
                navigate("/dashboard/user/log");
                window.location.reload();
            } else if (decoded.usertype === "LOB") {
                navigate("/dashboard/admin/lob");
                window.location.reload();
            } else {
                navigate("/dashboard/admin/request");
                window.location.reload();
            }
        } else {
            if (json.error) setalertdata({
                alertType: "danger",
                alertMessage: json.error,
            });
            else if (json.password) setalertdata({
                alertType: "danger",
                alertMessage: json.password,
            });
            else if (json.email) setalertdata({
                alertType: "danger",
                alertMessage: json.email,
            });
            else setalertdata({
                alertType: "danger",
                alertMessage: "Email and Password is required",
            });
        }
    };

    // Return login component
    return (
        <>
            <div
                className={`alert alert-${alertdata.alertType}`}
                role="alert"
                style={{ borderRadius: "0px" }}
            >
                {alertdata.alertMessage}
            </div>
            <div className="text-center sign-in">
                <form
                    className="form-signin p-4 my-3 mx-3 shadow"
                    style={{ maxWidth: "30rem" }}
                >
                    <img src={profile} alt="profile" />
                    <h1 className="h3 mb-3 mt-3 font-weight-normal">Login</h1>
                    <input
                        type="email"
                        value={credentials.email}
                        name="email"
                        className="form-control"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    <input
                        type="password"
                        value={credentials.password}
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button
                        className="btn btn-lg btn-primary btn-block"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Log in
                    </button>
                    <p className="mt-5 mb-3 text-muted">&copy; Wells Fargo</p>
                </form>
            </div>
        </>
    );
}
