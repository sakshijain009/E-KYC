import React from "react";

export default function Access(props) {
    return (
        <div className="col-md-9 ms-sm-auto col-lg-10 my-1 mx-auto">
            <h3 className="mt-4 mb-2">Access History</h3>
            <div className="table-responsive">
                <table className="table table-striped table-md">
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Document</th>
                            <th>Access Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.accessHistory.length > 0 &&
                            props.accessHistory.map((element, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{element.dept}</td>
                                        <td>{element.doctype}</td>
                                        <td>{new Date(element.timestamp).toGMTString()}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
