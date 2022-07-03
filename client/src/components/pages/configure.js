import React, { useState, useEffect } from "react";
import bgVideo from "../assets/bgVideo.mp4";
import apis from "../../api";
import { MultiSelect } from "react-multi-select-component";
import Spinner from '../Spinner';

export default function Landing(props) {
    // React States
    const [doc, setdoc] = useState("");
    const [dept, setdept] = useState("");
    const [docError, setdocError] = useState(null);
    const [deptError, setdeptError] = useState(null);
    const [selected, setSelected] = useState([]);
    const [loadingdocs, setloadingdocs] = useState(false);
    const [loadingdepts, setloadingdepts] = useState(false);

    let options = [];
    useEffect(() => {
        addDocOptions();
    });

    async function addDocOptions() {
        if (props.doctypes.length > 0) {
            for (const element in props.doctypes) {
                const temp = {
                    label: props.doctypes[element].doctype,
                    value: props.doctypes[element].doctype,
                };
                options.push(temp);
            }
        }
    }

    const onAddingDept = async (event) => {
        event.preventDefault();

        if (dept === "") {
            setdeptError({
                message: "Kindly Add Department Name!",
                color: "red",
            });
            return;
        }

        if (selected.length === 0) {
            setdeptError({
                message: "Kindly Add Documents!",
                color: "red",
            });
            return;
        }

        setloadingdocs(true);

        let deptArray = [];
        for (const element in selected) {
            deptArray.push(selected[element].value);
        }

        let response = await apis.public
            .addNewDepts({
                department: dept,
                docs: deptArray,
            })
            .then((res) => res.json());

        if (response.error) {
            setdeptError({
                message: response.error,
                color: "red",
            });
            setloadingdocs(false)
        } else {
            setdeptError({
                message: "Added Successfully",
                color: "green",
            });
            setdept("");
            setSelected([]);
            setloadingdocs(false)
            props.getAllDeptDocs();
        }
    };

    const onAddingDoc = async (event) => {
        event.preventDefault();

        if (doc === "") {
            setdocError({
                message: "Kindly Add Document Name!",
                color: "red",
            });
            return;
        }

        setloadingdepts(true);

        let response = await apis.public
            .addNewDocs({
                type: doc,
            })
            .then((res) => res.json());

        if (response.error) {
            setdocError({
                message: response.error,
                color: "red",
            });
            setloadingdepts(false);
        } else {
            setdocError({
                message: "Added Successfully",
                color: "green",
            });
            setdoc("");
            setloadingdepts(false);
            props.getAllDoctypes()
        }
    };

    return (
        <>
            <div className="main">
                <div className="overlay"></div>
                <video src={bgVideo} autoPlay loop muted />
                <div className="content">
                    <div className="row justify-content-center container">
                        <div className="col-md-9">
                            <div className="row">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title mt-3 mb-2">
                                            <i className="fa-solid fa-gear"></i>
                                            &nbsp; Configure Documents
                                        </h5>
                                        <h6 className="card-subtitle mb-2 text-muted mb-3">
                                            Add Documents you want to add in the
                                            Application
                                        </h6>
                                        {docError && (
                                            <p
                                                style={{
                                                    color: `${docError.color}`,
                                                    backgroundColor:
                                                        "transparent",
                                                    fontSize: "small",
                                                }}
                                            >
                                                {docError.message}
                                            </p>
                                        )}
                                        <form className="row g-3">
                                            <div className="col-auto">
                                                <input
                                                    type="text"
                                                    required
                                                    value={doc}
                                                    onChange={(e) => {
                                                        setdoc(e.target.value);
                                                    }}
                                                    className="form-control"
                                                    id="doctype"
                                                    placeholder="Document Name"
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <button
                                                    type="submit"
                                                    onClick={onAddingDoc}
                                                    className="btn btn-primary mb-3"
                                                >
                                                    Add Document
                                                </button>
                                            </div>
                                            {loadingdocs && <Spinner />}
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="card mt-4">
                                    <div className="card-body">
                                        <h5 className="card-title mt-3 mb-2">
                                            <i className="fa-solid fa-gear"></i>
                                            &nbsp; Configure Departments
                                        </h5>
                                        <h6 className="card-subtitle mb-2 text-muted mb-4">
                                            Add Departments and Documents it
                                            requires for KYC
                                        </h6>
                                        {deptError && (
                                            <p
                                                style={{
                                                    color: `${deptError.color}`,
                                                    backgroundColor:
                                                        "transparent",
                                                    fontSize: "small",
                                                }}
                                            >
                                                {deptError.message}
                                            </p>
                                        )}
                                        <form className="row g-3">
                                            <div className="col-6">
                                                <MultiSelect
                                                    options={options}
                                                    value={selected}
                                                    onChange={setSelected}
                                                    labelledBy={"Select"}
                                                    isCreatable={true}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <input
                                                    type="text"
                                                    required
                                                    value={dept}
                                                    onChange={(e) => {
                                                        setdept(e.target.value);
                                                    }}
                                                    className="form-control"
                                                    id="deptype"
                                                    placeholder="Department Name"
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary mb-3"
                                                    onClick={onAddingDept}
                                                >
                                                    Add Department
                                                </button>
                                            </div>
                                            {loadingdepts && <Spinner />}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container py-5">
                <h1 className="my-5">Department Details</h1>
                <table className="table table-dark table-hover table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Department</th>
                            <th scope="col">Documents</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.deptypes.length > 0 &&
                            props.deptypes.map((element, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{element.department}</td>
                                        <td>{element.doc_type.join(",  ")}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                <p className="mt-5 mb-3 text-muted text-center">&copy; Wells Fargo</p>
            </div>
        </>
    );
}
