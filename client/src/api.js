const API_ROOT = "http://localhost:5001";

// Register a user
async function register(user) {
    return fetch(`${API_ROOT}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
}

// Get user data from email id in search user
async function getUserDataFromEmail(emailID) {
    return fetch(`${API_ROOT}/api/user/customer/${emailID}`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Get user data from email id in search user
async function getUserDocsDataFromEmail(emailID) {
    return fetch(`${API_ROOT}/api/user/doc/all/${emailID}`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Get access history of customer
async function getCustomerAccessHistory() {
    return fetch(`${API_ROOT}/api/user/accesshist`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Get user data from email id in search user
async function getUserSpecificDocsFromEmail(emailID, doctype) {
    return fetch(`${API_ROOT}/api/user/doc/specific/${emailID}/${doctype}`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Post Documents by customer
async function postFiles(data) {
    return fetch(`${API_ROOT}/api/doc/upload`, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
}

// Get file from database to verify
async function getFilefromDb(filename) {
    return fetch(`${API_ROOT}/api/doc/fileinfo/${filename}`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Get all Document types
async function getAllDotypes() {
    return fetch(`${API_ROOT}/api/doc/doctypes`, {
        method: "GET",
    });
}

// Get all Department Docs
async function getAllDeptDocs() {
    return fetch(`${API_ROOT}/api/doc/dept`, {
        method: "GET",
    });
}

// Get user data to populate frontend
async function getUserData() {
    return fetch(`${API_ROOT}/api/user`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Permission Check for LOB to access customer docs
async function permissionCheck(data) {
    return fetch(`${API_ROOT}/api/notif/permission/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
}

// API when LOB accepts the KYC Request
async function permissionRequestAccept(data) {
    return fetch(`${API_ROOT}/api/notif/permission/request/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
}

// API when LOB rejects the KYC Request
async function permissionRequestReject(data) {
    return fetch(`${API_ROOT}/api/notif/permission/request/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
}

// Get all KYC requests by only Verifier
async function getAllKYCRequest() {
    return fetch(`${API_ROOT}/api/user/kyc/all`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Get all KYC requests by only Verifier
async function getAUserKYCRequest() {
    return fetch(`${API_ROOT}/api/user/customer/kyc/all`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Get Customer side notifications
async function getUserNotifs() {
    return fetch(`${API_ROOT}/api/notif/user`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

// Send Notification to Customer
async function sendNotif(data) {
    return fetch(`${API_ROOT}/api/notif/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
}

async function uploadCheck(data) {
    return fetch (`${API_ROOT}/api/notif/plsuploadcheck`,{
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token") 
        },
        body: JSON.stringify(data),
    });
}

async function sendMail(data) {
    return fetch (`${API_ROOT}/api/notif/mail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
}

// To get in response all access requests
async function getPermissionReqs(data) {
    return fetch(`${API_ROOT}/api/notif/getpermissionreqs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
}

// To accept permission to access documents
async function acceptPermission(data) {
    return fetch(`${API_ROOT}/api/notif/permission/request/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
}

// To reject permission to access documents
async function rejectPermission(data) {
    return fetch(`${API_ROOT}/api/notif/permission/request/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
}

// To add new documents
async function addNewDocs(data) {
    return fetch(`${API_ROOT}/api/doc/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

// To add new departments
async function addNewDepts(data) {
    return fetch(`${API_ROOT}/api/doc/dept/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

async function getVerifierAccess() {
    return fetch(`${API_ROOT}/api/user/verifier/docs`, {
        method: "GET",
        headers: { "x-access-token": localStorage.getItem("token") },
    });
}

const apis = {
    auth: {
        register,
    },
    user: {
        getUserData,
        getAUserKYCRequest,
        postFiles,
        getUserNotifs,
        getPermissionReqs,
        rejectPermission,
        acceptPermission,
        getCustomerAccessHistory,
        getVerifierAccess
    },
    bank: {
        getAllKYCRequest,
        getFilefromDb,
        getUserDataFromEmail,
        getUserDocsDataFromEmail,
        getUserSpecificDocsFromEmail,
        sendNotif,
        uploadCheck,
        sendMail,
        permissionCheck,
        permissionRequestAccept,
        permissionRequestReject,
    },
    public: {
        getAllDotypes,
        getAllDeptDocs,
        addNewDocs,
        addNewDepts,
    },
};

export default apis;
