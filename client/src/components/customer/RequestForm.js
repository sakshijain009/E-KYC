import React, { useState } from "react";
import axios from "axios";
import checklists from "../assets/checklists.png";
import Spinner from "../Spinner";

export default function RequestForm(props) {
    const [doctype, setdoctype] = useState("Aadhar");
    const [selectedFile, setSelectedFile] = useState(null);
    const [checkalert, setcheckalert] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    const submitForm = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            if (!selectedFile) {
                setcheckalert({
                    message: "File field cannot be empty.",
                    type: "danger",
                });
                return;
            }

            // console.log(selectedFile.name)
            let fileName = selectedFile.name;
            let ext =  fileName.split('.').pop();

            if(ext !== "pdf")
            {
                setcheckalert({
                    message: "You can only upload pdf files",
                    type: "danger",
                });
                return;   
            }
            formData.append("doc_type", doctype);
            formData.append("file", selectedFile);
            console.log(Object.fromEntries(formData));
            setisLoading(true);

            axios
                .post("http://localhost:5001/api/doc/upload", formData, {
                    headers: {
                        "Content-Type": "undefined",
                        "x-access-token": localStorage.getItem("token"),
                    },
                })
                .then((res) => {
                    setisLoading(false);
                    if (res.status === 201) {
                        setcheckalert({
                            message:
                                "Cannot re-upload a document, unless it is rejected by the Verifying Team!",
                            type: "danger",
                        });
                    } else {
                        setcheckalert({
                            message: "File Uploaded Successfully",
                            type: "success",
                        });
                        props.getKYCInfo();
                    }
                })
                .catch((err) => {
                    setisLoading(false);
                    setcheckalert(null);
                    alert("Some Error Occurred");
                });
        } catch (err) {
            setcheckalert(null);
            setisLoading(false);
            console.log(err, "in post files inside RequestForm");
        }
    };

    return (
        <div className="container col-md-9 my-3 py-3 px-2">
            <h3 className="mt-2 mb-4">Upload Files For KYC</h3>
            {checkalert && (
                <div className={`alert alert-${checkalert.type}`} role="alert">
                    <strong>Alert! </strong>
                    {checkalert.message}
                </div>
            )}
            <form className="row gy-2 gx-3 align-items-center">
                <div className="col-auto">
                    <input
                        className="form-control"
                        type="file"
                        accept="application/pdf"
                        name="file"
                        required
                        onChange={(e) => {
                            setSelectedFile(e.target.files[0]);
                        }}
                    />
                </div>
                <div className="col-auto">
                    <select
                        className="form-select"
                        required
                        placeholder="Type of Doc..."
                        name="doc_type"
                        onChange={(e) => {
                            setdoctype(e.target.value);
                            console.log(doctype);
                        }}
                    >
                        {props.doctypes.length > 0 &&
                            props.doctypes.map((type, k) => {
                                return (
                                    <option value={type.doctype} key={k}>
                                        {type.doctype}
                                    </option>
                                );
                            })}
                        {/* <option value="Aadhar">Aadhar Card</option>
                        <option value="Pan">Pan Card</option>
                        <option value="Passport">Passport</option> */}
                    </select>
                </div>
                <div className="col-auto">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        onClick={submitForm}
                    >
                        Submit For KYC
                    </button>
                </div>
            </form>
            {isLoading && <Spinner />}

            <h5 className="mt-5 mb-4">Points To Make Sure KYC is Approved</h5>
            <ol className="list-group list-group-numbered my-3">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Scan Entire Document</div>
                        Make sure the entire document is visible in the picture
                        frame.
                    </div>
                    <i className="fa-solid fa-square-check text-success"></i>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Scan Clearly</div>
                        Make sure the document is clear and content is properly
                        visible.
                    </div>
                    <i className="fa-solid fa-square-check text-success"></i>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">
                            Proper Internet Connection
                        </div>
                        Make sure the internet connection is proper for the
                        files to be successfully uploaded.
                    </div>
                    <i className="fa-solid fa-square-check text-success"></i>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Once Document Uploaded</div>
                        You can view the document status in the Dashboard, any
                        updates regarding document will also be sent in
                        Notification center
                    </div>
                    <i className="fa-solid fa-square-check text-success"></i>
                </li>
            </ol>

            <div className="row shadow mt-5">
                <div className="col-md-3 col-sm-5">
                    <img className="img-fluid" src={checklists} alt="" />
                </div>
                <div className="col-md-9 col-sm-7 py-5">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <b className="text-muted">ID Proof - </b>PAN Card,
                            Driving License, Passport copy, Voter ID, Aadhaar
                            Card, or bank photo passbook.
                        </li>
                        <li className="list-group-item">
                            <b className="text-muted">Proof of Address - </b>
                            Recent landline or mobile bill, electricity bill,
                            passport copy, recent Demat account statement,
                            latest bank passbook, ration card, Voter ID, rental
                            agreement, Driving License, or Aadhaar card.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
