import React, { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import profile from "../assets/profile.png";

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeDepartment = this.onChangeDepartment.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePassword2 = this.onChangePassword2.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: "",
            email: "",
            type: "Customer",
            password: "",
            password2: "",
            department: "Home Loan",
            user: false,
            alertMessage: "Enter Your Details To Register",
            alertType: "primary",
        };
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value,
        });
    }
    onChangeEmail(e) {
        this.setState({
            email: e.target.value,
        });
    }
    onChangeType(e) {
        this.setState({
            type: e.target.value,
        });
    }
    onChangeDepartment(e) {
        this.setState({
            department: e.target.value,
        });
    }
    onChangePassword(e) {
        this.setState({
            password: e.target.value,
        });
    }
    onChangePassword2(e) {
        this.setState({
            password2: e.target.value,
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            role: this.state.type,
            password: this.state.password,
            password2: this.state.password2,
        };

        if (newUser.role === "LOB") {
            newUser.department = this.state.department;
        }

        axios
            .post("http://localhost:5001/api/auth/register", newUser)
            .then((res) => {
                this.setState({
                    alertType: "success",
                    alertMessage:
                        "User has been successfully registered! Proceed to Login.",
                    name: "",
                    email: "",
                    type: "Customer",
                    password: "",
                    password2: "",
                });
            })
            .catch((err) => {
                this.setState({
                    alertType: "danger",
                    alertMessage:
                        err.response.data[Object.keys(err.response.data)[0]],
                });
            });
    }

    render() {
        return (
            <>
                <div
                    className={`alert alert-${this.state.alertType}`}
                    role="alert"
                    style={{ borderRadius: "0px" }}
                >
                    {this.state.alertMessage}
                </div>
                <div
                    className="container mt-5 shadow p-3 mb-5 bg-body rounded text-center p-2 bg-light"
                    style={{ maxWidth: "30rem" }}
                >
                    {this.state.user && <Navigate to="/login" replace={true} />}

                    <form onSubmit={this.onSubmit}>
                        <img src={profile} alt="profile" />
                        <h3 className="my-3">Register Yourself</h3>
                        <div className="form-group my-2">
                            <input
                                type="text"
                                required
                                placeholder="Name"
                                className="form-control"
                                value={this.state.name}
                                onChange={this.onChangeName}
                            />
                        </div>
                        <div className="form-group my-2">
                            <input
                                type="text"
                                required
                                placeholder="Email"
                                className="form-control"
                                value={this.state.email}
                                onChange={this.onChangeEmail}
                            />
                        </div>
                        <div className="form-group my-2">
                            <select
                                required
                                placeholder="Type"
                                className="form-control"
                                value={this.state.type}
                                onChange={this.onChangeType}
                            >
                                <option value="Customer">Customer</option>
                                <option value="Verifier">Verifier</option>
                                <option value="LOB">LOB</option>
                            </select>
                        </div>
                        {this.state.type === "LOB" && (
                            <div className="form-group my-2">
                                <select
                                    required
                                    placeholder="Department"
                                    className="form-control"
                                    value={this.state.department}
                                    onChange={this.onChangeDepartment}
                                >
                                    {this.props.deptypes.length > 0 &&
                                        this.props.deptypes.map(
                                            (element, i) => {
                                                return (
                                                    <option
                                                        value={
                                                            element.department
                                                        }
                                                        key={i}
                                                    >
                                                        {element.department}
                                                    </option>
                                                );
                                            }
                                        )}
                                </select>
                            </div>
                        )}
                        <div className="form-group my-2">
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                className="form-control"
                                value={this.state.password}
                                onChange={this.onChangePassword}
                            />
                        </div>
                        <div className="form-group my-2">
                            <input
                                type="password"
                                required
                                placeholder="Re Enter Password"
                                className="form-control"
                                value={this.state.password2}
                                onChange={this.onChangePassword2}
                            />
                        </div>
                        <div className="form-group my-3">
                            <input
                                type="submit"
                                value="Register"
                                className="btn btn-primary"
                            />
                        </div>
                        <p className="mt-5 mb-3 text-muted">
                            &copy; Wells Fargo
                        </p>
                    </form>
                </div>
            </>
        );
    }
}
