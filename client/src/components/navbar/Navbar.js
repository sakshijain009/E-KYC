import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar(props) {

    // navigate to some page
    const navigate = useNavigate();

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand lead" to="/">
                        <span style={{ color: "#7ad82d" }}>e</span>KYC
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/">
                                    Home
                                </Link>
                            </li>
                            {props.isLoggedin && props.isUserType === "Customer" && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        aria-current="page"
                                        to="/dashboard/user/log"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                            {!props.isLoggedin && (
                                <li className="nav-item dropdown active">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        to="/"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Sign In
                                    </Link>
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="navbarDropdown"
                                    >
                                        <Link className="dropdown-item" to="/login">
                                            Login
                                        </Link>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/register">
                                                Register
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            )}
                            {!props.isLoggedin && (
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" to="/configure">
                                        <i className="fa-solid fa-gear"></i>
                                        &nbsp; Configure
                                    </Link>
                                </li>
                            )}
                            {props.isLoggedin && props.isUserType === "Verifier" && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        aria-current="page"
                                        to="/dashboard/admin/searchkyc"
                                    >
                                        Search
                                    </Link>
                                </li>
                            )}
                            {props.isLoggedin && props.isUserType === "Verifier" && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        aria-current="page"
                                        to="/dashboard/admin/request"
                                    >
                                        Requests
                                    </Link>
                                </li>
                            )}
                            {props.isLoggedin && props.isUserType === "Verifier" && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        aria-current="page"
                                        to="/dashboard/admin/verifieddocs"
                                    >
                                        Verified Documents
                                    </Link>
                                </li>
                            )}
                            {props.isLoggedin && props.isUserType === "LOB" && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        aria-current="page"
                                        to="/dashboard/admin/lob"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                            {props.isLoggedin && (
                                <li className="nav-item">
                                    <span
                                        style={{ cursor: "pointer" }}
                                        className="nav-link"
                                        aria-current="page"
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            navigate("/");
                                            window.location.reload();
                                        }}
                                    >
                                        Logout
                                    </span>
                                </li>
                            )}
                        </ul>
                        {/* <form className="d-flex" role="search">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-success" type="submit">
                                Search
                            </button>
                        </form> */}
                    </div>
                </div>
            </nav>
        </>
    );
}
