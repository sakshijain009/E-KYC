import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import Navbar from "./components/navbar/Navbar";
import SeperateDashboard from "./components/pages/SeperateDashboard";
import Landing from "./components/pages/Landing";
import Register from "./components/auth/register";
import jwt_decode from "jwt-decode";
import apis from "./api";
import Configure from "./components/pages/configure";

// Render App Element
export default function App() {
    const [isLoggedin, setisLoggedin] = useState(false);
    const [isUserType, setisUserType] = useState(null);
    const [deptypes, setdeptypes] = useState({});
    const [doctypes, setdoctypes] = useState({});

    useEffect(() => {
        checkIsLoggedin();
        getAllDeptDocs();
        getAllDoctypes();
    }, []);

    async function getAllDeptDocs() {
        try {
            let response = await apis.public
                .getAllDeptDocs()
                .then((res) => res.json());

            if (!response.error) {
                setdeptypes(response);
            } else {
                console.log(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting all department types");
        }
    }

    async function getAllDoctypes() {
        try {
            let response = await apis.public
                .getAllDotypes()
                .then((res) => res.json());

            if (!response.error) {
                setdoctypes(response);
            } else {
                console.log(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting uall document types");
        }
    }

    const logIn = (type) => {
        setisLoggedin(true);
        setisUserType(type);
    };

    const logOut = () => {
        setisLoggedin(false);
        setisUserType(null);
    };

    async function checkIsLoggedin() {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                console.log("token ", token);
                let decoded = jwt_decode(token);
                logIn(decoded.usertype);
            } else {
                logOut();
            }
        } catch (err) {
            console.log(err, "in checking logged in");
        }
    }

    return (
        <>
            <Navbar isLoggedin={isLoggedin} isUserType={isUserType} />
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        <Landing />
                    }
                />
                <Route
                    exact
                    path="/dashboard/*"
                    element={
                        <SeperateDashboard
                            doctypes={doctypes}
                            deptypes={deptypes}
                            isUserType={isUserType}
                            isLoggedin={isLoggedin}
                        />
                    }
                />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register deptypes={deptypes} />} />
                <Route exact path="/configure" element={<Configure deptypes={deptypes} doctypes={doctypes} getAllDeptDocs={getAllDeptDocs} getAllDoctypes={getAllDoctypes} />} />
            </Routes>
        </>
    );
}
