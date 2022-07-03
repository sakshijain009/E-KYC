import React from "react";

export default function log(props) {
    return (
        <>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mx-auto">
                <h2 className="my-3">{props.title}</h2>
                <div className="card my-3 bg-dark">
                    <div className="card-body text-light">
                        Dear Customer, This is the Dashboard where you can see
                        the status of all your documents sent for KYC. In case
                        the document is rejected the reason of rejection will be
                        sent in notifications.
                        <br />
                        <span className="badge text-bg-info my-2">
                            In case of any queries, contact us on 900900XXXX
                            &nbsp;<i className="fa-solid fa-phone"></i>
                        </span>
                    </div>
                </div>
                <hr />
                <div className="table-responsive">
                    <table className="table table-striped table-md">
                        <thead>
                            <tr>
                                {props.kycdata.length > 0 &&
                                    Object.keys(props.kycdata[0]).map(
                                        (key, i) => {
                                            return (
                                                <th scope="col" key={i}>
                                                    {key}
                                                </th>
                                            );
                                        }
                                    )}
                            </tr>
                        </thead>
                        <tbody>
                            {props.kycdata.length > 0 &&
                                props.kycdata.map((key, i) => {
                                    return (
                                        <tr key={i}>
                                            {Object.entries(key).map(
                                                ([k, v]) => {
                                                    return <td key={k}>{v}</td>;
                                                }
                                            )}
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                {props.kycdata.length === 0 && (
                    <div className="alert alert-primary" role="alert">
                        Dear Customer, No Requests to Show!
                    </div>
                )}
            </main>
        </>
    );
}
