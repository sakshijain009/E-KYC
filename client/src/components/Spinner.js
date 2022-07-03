import React from "react";
import loading from "./assets/loading.gif";

export default function Spinner() {
    return (
        <div className="text-center my-3">
            <p style={{ marginBottom: "-3px",backgroundColor:"white" }}>Please Wait</p>
            <img src={loading} alt="loading" />
        </div>
    );
}
