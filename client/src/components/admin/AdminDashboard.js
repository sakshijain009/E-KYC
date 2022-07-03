import React, { useState, useEffect } from "react";
import Profile from "../pages/Profile";
import { Routes, Route } from "react-router-dom";
import SearchKYCForm from "./SearchKYCForm";
import ApproveKYC from "./ApproveKYC";
import ListDocs from "./ListDocs"
import apis from "../../api";
import LobDashboard from "../lob/lobDashboard";

export default function AdminDashboard(props) {
    const [kycRequests, setkycRequests] = useState({});
    const [userDetails, setuserDetails] = useState({});
    const [accesshists, setaccesshists] = useState({});

    useEffect(() => {
        getUserInfo();
        if (props.isUserType === "Verifier") {
            getAllKYCInfo();
            getAllVerifiedDocs();
        }
    }, [props.isUserType]);

    // GET PROFILE INFORMATION
    async function getUserInfo() {
        try {
            let response = await apis.user
                .getUserData()
                .then((res) => res.json());

            if (!response.error) {
                setuserDetails(response);
            } else {
                console.log(response.error);
                alert(response.error);
            }
        } catch (err) {
            console.log(
                err,
                "in Getting user info for populating user admin side"
            );
        }
    }

    // GET KYC REQUESTS
    async function getAllKYCInfo() {
        try {
            let response = await apis.bank
                .getAllKYCRequest()
                .then((res) => res.json());

            console.log("kyc respones", response)
            if (!response.error) {
                setkycRequests(response);
            } else {
                console.log(response.error);
                alert(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting all KYC requests by verifier");
        }
    }

    async function getAllVerifiedDocs() {
        try {
            let response = await apis.user
                .getVerifierAccess()
                .then((res) => res.json());

            if (!response.error) {
                setaccesshists(response);
            } else {
                console.log(response.error);
                alert(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting all verified docs verifier");
        }
    }

    return (
        <div>
            <Profile userDetails={userDetails} />
            <Routes>
                <Route
                    exact
                    path="lob"
                    element={<LobDashboard userDetails={userDetails} />}
                ></Route>
                <Route
                    exact
                    path="searchkyc"
                    element={<SearchKYCForm isUserType={props.isUserType} />}
                ></Route>
                <Route
                    exact
                    path="request"
                    element={<ApproveKYC allkycdata={kycRequests} getAllKYCInfo={getAllKYCInfo} getAllVerifiedDocs={getAllVerifiedDocs} />}
                ></Route>
                <Route
                    exact
                    path="verifieddocs"
                    element={<ListDocs accesshists={accesshists} />}
                ></Route>
            </Routes>
        </div>
    );
}
