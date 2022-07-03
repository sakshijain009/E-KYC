import React, {useState} from "react";
import apis from "../../api";
import Spinner from "../Spinner";

export default function Department(props) {

    const [isloading, setisloading] = useState({
        status: false
    });

    // Accept the permission request
    const onAcceptPermission = async (event, notif_id, i) => {
        event.preventDefault();

        setisloading({
            status: true,
            number: i
        });
        let response = await apis.user.acceptPermission({
            id: notif_id,
        });

        if (response.status === 200) {
            props.getPermissionRequests();
            
        } else if (response.error) {
            console.log(response.error);
        }
        setisloading({
            status: false
        });
    };

    // Reject the permission request
    const onRejectPermission = async (event, notif_id, i) => {
        event.preventDefault();

        setisloading({
            status: true,
            number: i
        });
        let response = await apis.user.rejectPermission({
            id: notif_id,
        });

        if (response.status === 200) {
            props.getPermissionRequests();
        } else if (response.error) {
            console.log(response.error);
        }
        setisloading({
            status: false
        });
    };

    return (
        <>
            <div className="col-md-9 ms-sm-auto col-lg-10 my-1 mx-auto px-4">
                {props.permissionReq.length > 0 && (
                    <h3 className="mt-4">Access Requests</h3>
                )}
                {props.permissionReq.length > 0 &&
                    props.permissionReq
                        .filter(
                            (element) => element.permission_status === "Pending"
                        )
                        .map((element, i) => {
                            return (
                                <div
                                    className="card py-2 px-3 shadow-sm my-2"
                                    key={i}
                                >
                                    <div className="card-body row justify-content-evenly">
                                        <h6>{element.message}</h6>

                                        <div
                                            className="btn-group my-2"
                                            role="group"
                                            aria-label="Basic mixed styles example"
                                        >
                                            <button
                                                type="button"
                                                disabled={isloading.status && isloading.number===i}
                                                className="btn btn-danger"
                                                onClick={(e) =>
                                                    onRejectPermission(
                                                        e,
                                                        element._id,
                                                        i
                                                    )
                                                }
                                            >
                                                Deny
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                disabled={isloading.status && isloading.number===i}
                                                onClick={(e) =>
                                                    onAcceptPermission(
                                                        e,
                                                        element._id,
                                                        i
                                                    )
                                                }
                                            >
                                                Accept
                                            </button>
                                        </div>
                                        {isloading.status && isloading.number===i && <Spinner />}
                                    </div>
                                </div>
                            );
                        })}
                <table className="table table-hover table-striped mt-4 table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Department</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.permissionReq.length > 0 &&
                            props.permissionReq
                                .filter(
                                    (element) =>
                                        element.permission_status !== "Pending"
                                )
                                .map((e, i) => {
                                    let color =
                                        e.permission_status !== "Rejected"
                                            ? "success"
                                            : "danger";
                                    return (
                                        <tr key={i}>
                                            <td>{e.dept}</td>
                                            <td className={`text-${color}`}>
                                                {e.permission_status}
                                            </td>
                                        </tr>
                                    );
                                })}
                        {props.permissionReq.length >= 0 &&
                            props.permissionReq.filter(
                                (element) =>
                                    element.permission_status !== "Pending"
                            ).length <= 0 && (
                                <tr>
                                    <td colSpan="2">
                                        There are currently no user actions to
                                        show
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>

                <hr className="mt-5" />
                <h3 className="my-4">Department Details</h3>
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
            </div>
        </>
    );
}
