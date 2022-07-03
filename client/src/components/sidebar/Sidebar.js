import React from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar(props) {
    let location = useLocation();

    return (
        <>
            <nav
                id="sidebarMenu"
                className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
            >
                <div className="position-sticky pt-3">
                    <div className="container mx-2 p-1">
                        <h6>
                            <i className="fa-solid fa-user"></i>&nbsp; Hello,{" "}
                            {props.user.name}
                        </h6>
                        <span className="badge text-bg-success">
                            {props.user.email}
                        </span>
                    </div>
                    <hr />
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/dashboard/user/log"
                                        ? "active"
                                        : ""
                                }`}
                                aria-current="page"
                                to="/dashboard/user/log"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname ===
                                    "/dashboard/user/request"
                                        ? "active"
                                        : ""
                                }`}
                                to="/dashboard/user/request"
                            >
                                Request KYC
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname ===
                                    "/dashboard/user/department"
                                        ? "active"
                                        : ""
                                }`}
                                to="/dashboard/user/department"
                            >
                                Department Requests
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname ===
                                    "/dashboard/user/access"
                                        ? "active"
                                        : ""
                                }`}
                                to="/dashboard/user/access"
                            >
                                Access History
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname ===
                                    "/dashboard/user/notifs"
                                        ? "active"
                                        : ""
                                }`}
                                to="/dashboard/user/notifs"
                            >
                                Notification Center
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
