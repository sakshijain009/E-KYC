import React from "react";

export default function NotifCenter(props) {
    return (
        <>
            <div className="col-md-9 ms-sm-auto col-lg-10 my-1 mx-auto">
                <h3 className="mt-4 mb-5">Notification Center</h3>
                {props.notifdata.length > 0 &&
                    props.notifdata.map((element, i) => {
                        return (
                            <div
                                className="alert alert-warning notif"
                                role="alert"
                                key={i}
                                style={{ marginTop: "-9px" }}
                            >
                                <i className="fa-solid fa-bell"></i> &nbsp;{" "}
                                {new Date(element.timestamp).toGMTString()} -{" "}
                                {element.message}
                            </div>
                        );
                    })}
                {props.notifdata.length === 0 && (
                    <div className="alert alert-primary" role="alert">
                        Dear Customer, No Notifications to Show!
                    </div>
                )}
            </div>
        </>
    );
}
