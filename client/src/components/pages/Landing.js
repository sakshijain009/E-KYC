import React from "react";
import bgVideo from "../assets/bgVideo.mp4";

export default function Landing() {
    return (
        <>
            <div className="main">
                <div className="overlay"></div>
                <video src={bgVideo} autoPlay loop muted />
                <div className="content">
                    <div className="row justify-content-center container">
                        <div className="col-md-8">
                            <h5 style={{ color: "white", fontSize: "7vh" }}>
                                E-KYC - A Blockchain Based KYC Application
                            </h5>
                        </div>   
                    </div>
                </div>
            </div>
        </>
    );
}
