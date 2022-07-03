import React, { useState } from "react";
import apis from "../../api";
import Web3 from "web3";
import Spinner from "../Spinner";
import Progress from "react-progressbar";
import validator from "validator";

export default function LobDashboard(props) {
    // Check if blockchain is connected
    let flag = 0;
    const web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );

    web3.eth.net
        .isListening()
        .then((s) => {
            console.log("Blockchain connection active");
            flag = 1;
        })
        .catch((e) => {
            console.log("Blockchain not connected");
        });

    // React states declaration
    const [credentials, setCredentials] = useState({
        email: "",
    });

    const [userData, setUserData] = useState(null);
    const [docUrl, setdocUrl] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(5);
    const [emailError, setEmailError] = useState({
        valid: false,
        message: "",
    });
    const [checkalert, setcheckalert] = useState(null);
    const [accessStatus, setaccessStatus] = useState(null);
    const [notifalert, setnotifalert] = useState(null);

    // Functions declared
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setaccessStatus(null);
        setUserData(null);
        setnotifalert(null);

        if (validator.isEmail(e.target.value)) {
            setEmailError({
                message: "Email is Valid...",
                valid: true,
            });
        } else {
            setEmailError({
                message: "Kindly enter a valid Email!",
                valid: false,
            });
        }
    };

    // Get User Documents via Email
    const searchUserWithEmail = async (event, email) => {
        event.preventDefault();
        setEmailError({
            message: "",
            valid: false,
        });
        let final_docs = [];
        setisLoading(true);

        // Get Permission
        await apis.bank
            .permissionCheck({
                customer_email: email,
                dept: props.userDetails.department,
            })
            .then((res) => {
                console.log(res);
                if (res.status === 201) {
                    setaccessStatus({
                        message:
                            "Request " + credentials.email + " To Give Access To The Documents",
                        disabled: false,
                        buttonMessage: "Request Access",
                        type: "danger",
                        access: false,
                    });
                } else if (res.status === 202) {
                    setaccessStatus({
                        message:
                            "Requested " + credentials.email + " for Access, Yet to be Accepted",
                        disabled: true,
                        buttonMessage: "Pending",
                        type: "warning",
                        access: false,
                    });
                } else if (res.status === 204) {
                    setaccessStatus({
                        message: credentials.email + " has rejected the access request",
                        disabled: false,
                        buttonMessage: "Request Again",
                        type: "danger",
                        access: false,
                    });
                } else if (res.status === 203) {
                    setaccessStatus({
                        message: credentials.email + " has accepted access request",
                        disabled: true,
                        buttonMessage: "Accepted",
                        type: "success",
                        access: true,
                    });
                }
            });

        // Get Document Details
        for (const x in props.userDetails.documents) {
            try {
                let response = await apis.bank
                    .getUserSpecificDocsFromEmail(
                        email,
                        props.userDetails.documents[x]
                    )
                    .then((res) => res.json());
                if (!response.error) {
                    if (response.length === 0) {
                        let not_submitted = {
                            doc_type: props.userDetails.documents[x],
                            status: "Not Uploaded",
                            approved_verifier_id: "Not Applicable",
                        };
                        final_docs.push(not_submitted);
                    } else {
                        final_docs.push(response[0]);
                    }
                } else {
                    setisLoading(false);
                    setUserData(null);
                    alert(response.error);
                    return;
                }
            } catch (err) {
                setisLoading(false);
                console.log(err, "in Getting all records of user");
            }
        }
        setisLoading(false);
        setUserData(final_docs);
        setnotifalert(null);
    };

    // View Document on IPFS
    const viewKYCDoc = async (event, email, type) => {
        event.preventDefault();

        if (flag === 1) {
            try {
                const response = await fetch(
                    "http://localhost:5001/api/doc/gethashblock/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": localStorage.getItem("token"),
                        },
                        body: JSON.stringify({
                            username: email,
                            doctype: type,
                        }),
                    }
                );
                const json = await response.json();
                console.log(json, "json hash");
                setCurrentProgress(50);

                let url =
                    "https://ipfs.io/ipfs/" + json.document + "#toolbar=0";
                setdocUrl(url);
                if (json.document.length !== 46) {
                    setcheckalert({
                        message: json.document,
                        type: "danger",
                    });
                    return;
                }

                let response1 = await apis.bank
                    .sendNotif({
                        customer_email: email,
                        message:
                            "The " +
                            props.userDetails.department +
                            " Department has accessed your " +
                            type +
                            " document.",
                        notiftype: "access_doc",
                        dept: props.userDetails.department,
                        doctype: type
                    })
                    .then((res) => res.json());

                if (response1.error) {
                    console.log(response1.error);
                }
            } catch (err) {
                console.log(err, "in getting hash from blockchain");
            }
        } else {
            alert("Cannot fetch the document! WEB3 not active");
        }
    };

    // Notify User to Upload Documents
    const notifyUpload = async (event, email, type, status) => {
        event.preventDefault();

        apis.bank.uploadCheck({
            customer_email: email,
            doctype: type,
        })
            .then((res) => {
                console.log(res.status);
                if (res.status === 200) {
                    let midmessage = " Department has requested you to "
                    if (status === "Rejected") {
                        midmessage = midmessage + "re-upload the "
                    }
                    else {
                        midmessage = midmessage + "upload the "
                    }
                    let response = apis.bank.sendNotif({
                        customer_email: email,
                        message:
                            "The " +
                            props.userDetails.department +
                            midmessage +
                            type +
                            " document!",
                        notiftype: "pls_upload",
                        doctype: type,
                    });

                    apis.bank.sendMail({
                        customer_email: email,
                        message:
                            "The " +
                            props.userDetails.department +
                            midmessage +
                            type +
                            " document!",
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                setnotifalert({
                                    message:
                                        "The Customer is notified and the mail has been sent",
                                    type: "success",
                                });
                                setisLoading(false);
                            } else {
                                console.log(res.error);
                            }
                        });
                    if (response.error) {
                        console.log(response.error);
                    }
                }
                if (res.status === 201) {
                    setnotifalert({
                        message: "The Customer is already notified",
                        type: "danger",
                    });
                    setisLoading(false);
                }
            });
    };

    // Request Permission to access docs
    const requestPermission = async (event, email) => {
        event.preventDefault();

        let response = await apis.bank.sendNotif({
            customer_email: email,
            message:
                "The " +
                props.userDetails.department +
                " Department is requesting your Permission For Accessing Documents",
            notiftype: "view_request",
            dept: props.userDetails.department,
        });

        if (response.status === 200) {
            setaccessStatus({
                message: "Requested " + credentials.email + " for Access, Yet to be Accepted",
                disabled: true,
                buttonMessage: "Pending",
                type: "warning",
                access: false,
            });
        }

        if (response.error) {
            console.log(response.error);
        }
    };

    return (
        <>
            <div className="container my-3 py-3">
                {emailError.message !== "" && (
                    <div className="alert alert-primary" role="alert" id="#alert">
                        {emailError.message}
                    </div>
                )}
                {checkalert && (
                    <div
                        className={`alert alert-${checkalert.type}`}
                        role="alert"
                    >
                        <strong>Alert! </strong>
                        {checkalert.message}
                    </div>
                )}

                <form className="row mx-auto text-center">
                    <div className="col-lg-10 col-md-8">
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={handleChange}
                            name="email"
                            className="form-control"
                            placeholder="Enter Email here..."
                        />
                    </div>
                    <div className="col-auto">
                        <button
                            type="submit"
                            className="btn btn-primary mb-3"
                            disabled={!emailError.valid}
                            onClick={(event) =>
                                searchUserWithEmail(event, credentials.email)
                            }
                        >
                            Search User
                        </button>
                    </div>
                </form>

                {accessStatus && (
                    <div
                        className={`alert alert-${accessStatus.type} my-2 shadow`}
                        role="alert"
                    >
                        <h4>Access Status</h4>
                        {accessStatus.message}
                        <br />
                        <button
                            type="button"
                            className="btn btn-primary my-2"
                            disabled={accessStatus.disabled}
                            onClick={(event) =>
                                requestPermission(event, credentials.email)
                            }
                        >
                            {accessStatus.buttonMessage}
                        </button>
                    </div>
                )}
            </div>

            <div className="container">
                {isLoading && <Spinner />}
                <hr />
                <h4>Document Status</h4>
                {notifalert && (
                    <div
                        className={`alert alert-${notifalert.type}`}
                        role="alert"
                    >
                        {notifalert.message}
                    </div>
                )}
                <div className="row">
                    {userData &&
                        userData.map((element, i) => {
                            let color =
                                element.status === "Rejected"
                                    ? "#F72119"
                                    : element.status === "Accepted"
                                        ? "#44D62C"
                                        : "#E0E722";

                            let buttonMessage =
                                element.status === "Accepted"
                                    ? "View Document"
                                    : element.status === "Pending"
                                        ? "Waiting For Approval"
                                        : "Notify to Upload";
                            let isdisabled =
                                accessStatus.access
                                    ? element.status === "Pending"
                                        ? true
                                        : false
                                    : true;

                            return (
                                <div className="col-12" key={i}>
                                    <div
                                        className="card shadow my-2 bg-dark"
                                        style={{
                                            borderRadius: "0px",
                                            backgroundColor: color,
                                            color: "white"
                                        }}
                                    >
                                        <div className="card-body">
                                            <p>
                                                <span className="fw-bold">
                                                    Document{" - "}
                                                </span>
                                                {element.doc_type}
                                            </p>
                                            <p>
                                                <span className="fw-bold">
                                                    Status{" - "}
                                                </span>
                                                <span style={{ color: color }}>{element.status}</span>
                                            </p>
                                            <p>
                                                <span className="fw-bold">
                                                    Verifier{" - "}
                                                </span>
                                                {element.approved_verifier_id}
                                            </p>
                                            <button
                                                type="button"
                                                disabled={isdisabled}
                                                className="btn btn-md btn-primary"
                                                data-bs-toggle={
                                                    element.status ===
                                                        "Accepted"
                                                        ? "modal"
                                                        : ""
                                                }
                                                data-bs-target={
                                                    element.status ===
                                                        "Accepted"
                                                        ? "#exampleModal"
                                                        : ""
                                                }
                                                onClick={
                                                    element.status === "Accepted"
                                                        ? (event) =>
                                                            viewKYCDoc(
                                                                event,
                                                                credentials.email,
                                                                element.doc_type
                                                            )
                                                        : element.status === "Pending"
                                                            ? null
                                                            : (event) =>
                                                                notifyUpload(
                                                                    event,
                                                                    credentials.email,
                                                                    element.doc_type,
                                                                    element.status
                                                                ) && setisLoading(true)
                                                }
                                            >
                                                {buttonMessage}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>



            <div
                className="modal fade modal-xl"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="exampleModalLabel"
                            >
                                View Document
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    setdocUrl(null);
                                    setCurrentProgress(0);
                                }}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <Progress completed={currentProgress} />
                            {docUrl && currentProgress < 50 && (
                                <div>
                                    <p align="center">
                                        Getting hash from blockchain....
                                    </p>
                                    <object
                                        data={docUrl}
                                        width="100%"
                                        height="400px"
                                        aria-label="pdf-viewer"
                                        aria-labelledby="pdf-viewer"
                                        onLoad={() => {
                                            setCurrentProgress(100);
                                        }}
                                        alt=""
                                    ></object>
                                </div>
                            )}
                            {docUrl &&
                                currentProgress >= 50 &&
                                currentProgress < 100 && (
                                    <div>
                                        <p align="center">
                                            Loading file from IPFS ....
                                        </p>
                                        <Spinner />
                                        <object
                                            data={docUrl}
                                            width="100%"
                                            height="400px"
                                            aria-label="pdf-viewer"
                                            aria-labelledby="pdf-viewer"
                                            onLoad={() => {
                                                setCurrentProgress(100);
                                            }}
                                            alt=""
                                        ></object>
                                    </div>
                                )}

                            {docUrl && currentProgress === 100 && (
                                <div>
                                    <object
                                        data={docUrl}
                                        width="100%"
                                        height="400px"
                                        aria-label="pdf-viewer"
                                        aria-labelledby="pdf-viewer"
                                        onLoad={() => {
                                            setCurrentProgress(100);
                                        }}
                                        alt=""
                                    ></object>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    setdocUrl(null);
                                    setCurrentProgress(0);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-5 mb-3 text-muted text-center">
                &copy; Wells Fargo
            </p>
        </>
    );
}
