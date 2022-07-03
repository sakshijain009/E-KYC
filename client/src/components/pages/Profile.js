import React from "react";
import kyc from "../assets/kyc.jpg";

export default function Profile(props) {
    return (
        <>
            <div className="shadow">
                <div className="container py-2">
                    {props.userDetails.usertype === "LOB" && (
                        <h3
                            className="text-center my-3 p-3 bg-light shadow-sm"
                            style={{ color: "#3e478c" }}
                        >
                            <i className="fa-solid fa-building-user text-muted"></i>{" "}
                            &nbsp;{props.userDetails.department} Department
                        </h3>
                    )}
                    <div className="row my-3">
                        <div className="col-md-5 px-1">
                            <img alt="random" src={kyc} className="img-fluid" />
                        </div>
                        <div className="col-md-7 text-start my-3">
                            <h5 className="mt-4 text-muted">
                                {props.userDetails.usertype} User Profile
                            </h5>
                            <hr style={{ width: "50%", color: "#696969" }} />
                            <p className="fw-light lh-sm">
                                <b>Admin ID: </b>
                                {props.userDetails._id}
                            </p>
                            <p className="fw-light lh-sm">
                                <b>Name: </b>
                                {props.userDetails.name}
                            </p>
                            {props.userDetails.usertype === "LOB" && (
                                <p className="fw-light lh-sm">
                                    <b>Department: </b>
                                    {props.userDetails.department}
                                </p>
                            )}
                            {props.userDetails.usertype === "LOB" && (
                                <p className="fw-light lh-sm">
                                    <b>KYC Documents: </b>
                                    {props.userDetails.documents.join(", ")}
                                </p>
                            )}
                            <p className="fw-light lh-sm">
                                <b>Company:</b>&nbsp; Wells Fargo India
                                Solutions Private Ltd
                            </p>
                            <p className="fw-light lh-sm">
                                <b>Address: </b>Wells Fargo Centre Building 1A
                                Orion Sez Serilingampalli Andhea, Pradesh
                                Divyashree Raidurgam, Hyderabad, India, 500032
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
