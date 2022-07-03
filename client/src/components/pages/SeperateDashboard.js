import React from "react";
import { Routes, Route } from "react-router-dom"
import AdminDashboard from "../admin/AdminDashboard";
import UserDashboard from "../customer/UserDashboard";

export default function SeperateDashboard(props) {

  return (
    <>
        <Routes>
            <Route exact path="user/*" element={<UserDashboard deptypes={props.deptypes} doctypes={props.doctypes} />}></Route>
            <Route exact path="admin/*" element={<AdminDashboard isUserType={props.isUserType} isLoggedin={props.isLoggedin} />}></Route>
        </Routes>        
    </>
  );
}
