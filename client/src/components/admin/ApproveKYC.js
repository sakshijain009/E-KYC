import React, { useState } from "react";
import axios from "axios";
import ipfs from "../../ipfs";
import nodata from "../assets/nodata.png";
import Web3 from "web3";
import apis from "../../api";
import Spinner from "../Spinner";
import "./admin.css";

export default function ApproveKYC(props) {
    const [approveData, setapproveData] = useState(null);
    const [rejectMessage, setrejectMessage] = useState("");
    const [rejectLoading, setrejectLoading] = useState(false);
    const [start, setstart] = useState(false);
    const [gethash, setgethash] = useState(false);
    const [onblock, setonblock] = useState(false);
    const [docUrl, setdocUrl] = useState(null);

    let dochash = "";
    let doctype = "";
    let username = "";
    let blockData = {};
    let flag = false;
    let response;
    let response1;

    // WEB 3 INSTANCE
    const web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );

    web3.eth.net
        .isListening()
        .then((s) => {
            console.log("Blockchain connection active");
            flag = true;
        })
        .catch((e) => {
            flag = false;
            console.log("Blockchain not connected");
        });

    // ACCEPT THE DOCUMENT
    const onsubmitAccept = async (event, cmail, dtype, fname, cid) => {
        event.preventDefault();
        setstart(true);

        if (flag) {
            // URL TO GET THE FILE
            let url = "http://localhost:5001/api/doc/fileinfo/" + fname;
            console.log("url", url);
            axios.get(url, { responseType: "blob" }).then((res) => {
                const reader = new window.FileReader();
                let blob = new Blob([res.data], {
                    type: "application/pdf",
                });

                console.log(blob);

                // CREATE THE BUFFER
                let buffer = new ArrayBuffer();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = () => {
                    buffer = Buffer(reader.result);
                    console.log("buffer", buffer);

                    // SEND TO IPFS
                    ipfs.files.add(Buffer.from(buffer), (error, result) => {
                        if (error) {
                            console.error(error);
                            return;
                        }

                        dochash = result[0].hash;
                        username = cmail;
                        doctype = dtype;

                        //SEND HASH TO BLOCKCHAIN
                        blockData = {
                            username,
                            doctype,
                            dochash,
                        };

                        console.log(blockData);

                        if (dochash.length === 46) {
                            setgethash(1);
                            axios({
                                method: "post",
                                url: "http://localhost:5001/api/doc/puthashblock/",
                                headers: {},
                                data: {
                                    username: username,
                                    doctype: doctype,
                                    dochash: dochash,
                                },
                            })
                                .then((res) => {
                                    console.log(res.status);
                                })
                                .then(
                                    (response = fetch(
                                        "http://localhost:5001/api/doc/accept/" +
                                            cid +
                                            "/" +
                                            fname,
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                                "x-access-token":
                                                    localStorage.getItem(
                                                        "token"
                                                    ),
                                            },
                                        }
                                    )) && setonblock(1)
                                )
                                .then(
                                    (response1 = apis.bank.sendNotif({
                                        customer_email: cmail,
                                        message:
                                            "Document (" +
                                            dtype +
                                            ") has been approved by the Verifying Team!",
                                        notiftype: "ver_accept",
                                    }))
                                )
                                .then((res) => res.json())
                                .then(() => {
                                    props.getAllKYCInfo();
                                    props.getAllVerifiedDocs();
                                    window.location.reload();
                                })
                                .catch((err) => console.log(err));
                        }
                    });
                };
            });
        } else {
            alert("Cannot accept the document! WEB3 not active");
        }
    };

    // Set data before adding rejection message
    const setInitialData = async (event, cid, fname, email, doctype) => {
        event.preventDefault();
        setapproveData({
            id: cid,
            filename: fname,
            cemail: email,
            type: doctype,
        });
    };

    // Rejecting the document
    const onsubmitReject = async (event) => {
        event.preventDefault();
        setrejectLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5001/api/doc/reject/" +
                    approveData.id +
                    "/" +
                    approveData.filename,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        reject_message: rejectMessage,
                    }),
                }
            );
            if (response.error) {
                console.log(response.error);
                alert(response.error);
                setrejectLoading(false);
            }

            let response1 = await apis.bank
                .sendNotif({
                    customer_email: approveData.cemail,
                    message:
                        "Document (" +
                        approveData.type +
                        ") has been rejected! Reason : " +
                        rejectMessage,
                    notiftype: "ver_reject",
                })
                .then((res) => res.json());

            if (response1.error) {
                console.log(response1.error);
                alert(response1.error);
                setrejectLoading(false);
            } else {
                props.getAllKYCInfo();
                props.getAllVerifiedDocs();
                setrejectLoading(false);
                window.location.reload();
            }
        } catch (err) {
            alert("Some Error Occured");
            setrejectLoading(false);
        }
    };

    // Handle Reject Message Onchange
    const handleNotif = (e) => {
        setrejectMessage(e.target.value);
    };

    return (
        <div>
            {props.allkycdata.length > 0 &&
                props.allkycdata.map((element, i) => {
                    return (
                        <div className="card my-3 mx-3" key={i}>
                            <div className="card-body bg-dark">
                                <h5 className="card-title">
                                    <span className="badge text-bg-light">
                                        <i className="fa-solid fa-circle-user"></i>{" "}
                                        {element.customer.email}
                                    </span>
                                </h5>
                                <table className="table table-hover table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Document</th>
                                            <th scope="col">Filename</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">View</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {element.statusofDocs.map(
                                            (subelement, j) => {
                                                //console.log(subelement)
                                                return (
                                                    <tr key={j}>
                                                        <td>
                                                            {
                                                                element.customer
                                                                    .name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                subelement.doc_type
                                                            }
                                                        </td>
                                                        <td>
                                                            {subelement.filename.substring(
                                                                0,
                                                                subelement
                                                                    .filename
                                                                    .length - 19
                                                            )}
                                                        </td>
                                                        <td>
                                                            {subelement.status}
                                                        </td>
                                                        <td>
                                                            {/* <a
                                                                href={`http://localhost:5001/api/doc/fileinfo/${subelement.filename}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                View Doc
                                                            </a> */}
                                                            <button
                                                                type="button"
                                                                className="btn btn-md btn-primary"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exmodal"
                                                                onClick={() =>
                                                                    setdocUrl(
                                                                        `http://localhost:5001/api/doc/fileinfo/${subelement.filename}#toolbar=0`
                                                                    )
                                                                }
                                                            >
                                                                View Doc
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className="btn-group"
                                                                role="group"
                                                                aria-label="Basic mixed styles example"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    disabled={rejectLoading}
                                                                    className="btn btn-danger"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        setInitialData(
                                                                            event,
                                                                            element
                                                                                .customer
                                                                                ._id,
                                                                            subelement.filename,
                                                                            element
                                                                                .customer
                                                                                .email,
                                                                            subelement.doc_type
                                                                        )
                                                                    }
                                                                >
                                                                    Reject
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#eModal"
                                                                    disabled={
                                                                        start
                                                                    }
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        onsubmitAccept(
                                                                            event,
                                                                            element
                                                                                .customer
                                                                                .email,
                                                                            subelement.doc_type,
                                                                            subelement.filename,
                                                                            element
                                                                                .customer
                                                                                ._id
                                                                        )
                                                                    }
                                                                >
                                                                    Accept
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}

            {props.allkycdata.length === 0 && (
                <div className="container text-center py-1">
                    <img
                        src={nodata}
                        className="img-fluid"
                        alt="404"
                        style={{ height: "280px",filter: "grayscale(97%)" }}
                    />
                </div>
            )}

            <div
                className="modal"
                id="exmodal"
                tabIndex="-1"
                aria-labelledby="exModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                View Document
                            </h5>
                        </div>
                        <div className="modal-body">
                            <object
                                data={docUrl}
                                width="100%"
                                height="400px"
                                aria-label="pdf-viewer"
                                aria-labelledby="pdf-viewer"
                                alt=""
                            ></object>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    setdocUrl(null);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal"
                id="eModal"
                tabIndex="-1"
                aria-labelledby="eModalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                align="center"
            >
                <div className="modal-dialog" align="center">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div>
                                <p align="center">
                                    Storing the document
                                    <input type="checkbox" checked={gethash} />
                                </p>
                                <p align="center">
                                    Storing the hash on blockchain
                                    <input type="checkbox" checked={onblock} />
                                </p>
                            </div>
                            <br></br>
                            <Spinner />
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Reject Message
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label
                                        htmlFor="message-text"
                                        className="col-form-label"
                                    >
                                        Enter the Reason for Rejection
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="message-text"
                                        value={rejectMessage}
                                        onChange={handleNotif}
                                        name="notif"
                                        required
                                    ></textarea>
                                </div>
                                {rejectLoading && <Spinner />}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={onsubmitReject}
                                disabled={
                                    rejectMessage === "" ||
                                    rejectMessage.trim() === ""
                                }
                            >
                                Send message
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-5 mb-3 text-muted text-center">
                &copy; Wells Fargo
            </p>
        </div>
    );
}
