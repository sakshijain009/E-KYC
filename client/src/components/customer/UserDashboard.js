import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import Log from "./Log";
import RequestForm from "./RequestForm";
import NotifCenter from "./NotifCenter";
import Access from "./Access";
import Department from "./Department";
import { Routes, Route } from "react-router-dom"
import apis from "../../api";

export default function UserDashboard(props) {

    const [userDetails, setuserDetails] = useState({});
    const [kycDetails, setkycDetails] = useState({});
    const [notifDetails, setnotifDetails] = useState({});
    const [permissionReq, setpermissionReq] = useState({});
    const [accessHistory, setaccessHistory] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            getUserInfo();
            getKYCInfo();
            getNotifInfo();
            getPermissionRequests();
            getUserAcessHistory();
          }, 2000);
        
          return () => clearInterval(interval);
    }, []);


    async function getUserInfo() {
        try {
            let response = await apis.user.getUserData().then((res) => res.json());

            if (!response.error) {
                setuserDetails(response);
            } else {
                console.log(response.error);
                alert(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting user info for populating user");
        }
    }

    async function getUserAcessHistory() {
        try {
            let response = await apis.user.getCustomerAccessHistory().then((res) => res.json());

            if (!response.error) {
                setaccessHistory(response);
            } else {
                console.log(response.error);
                alert(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting user access history");
        }
    }

    async function getKYCInfo() {
        try {
            let response = await apis.user.getAUserKYCRequest().then((res) => res.json());
            if (!response.error) {
                setkycDetails(response);
            } else {
                console.log(response.error);
                alert(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting user info for populating user");
        }
    }
    
    async function getNotifInfo() {
        try {
            let response = await apis.user.getUserNotifs().then((res) => res.json());

            if (!response.error) {
                setnotifDetails(response);
            } else {
                console.log(response.error);
                alert(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting user info for populating user");
        }
    }

    async function getPermissionRequests() {
        try {
            let response = await apis.user.getPermissionReqs().then((res) => res.json());

            if (!response.error) {
                setpermissionReq(response);
            } else {
                console.log(response.error);
                alert(response.error);
            }
        } catch (err) {
            console.log(err, "in Getting access permission requests");
        }
    }


    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar user={userDetails} />
                    <Routes>
                        <Route exact path="log" element={<Log kycdata={kycDetails} title={"User Dashboard"} />}></Route>
                        <Route exact path="access" element={<Access accessHistory={accessHistory} />}></Route>
                        <Route exact path="request" element={<RequestForm doctypes={props.doctypes} getKYCInfo={getKYCInfo}/>}></Route>
                        <Route exact path="notifs" element={<NotifCenter notifdata={notifDetails}/>}></Route>
                        <Route exact path="department" element={<Department deptypes={props.deptypes} permissionReq={permissionReq} getPermissionRequests={getPermissionRequests}/>}></Route>
                    </Routes>
                </div>
            </div>
        </>
    );
}
