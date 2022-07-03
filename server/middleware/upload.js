const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;

const storage = new GridFsStorage({
    url: process.env.ATLAS_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        if (file.mimetype === "application/pdf") {
            return {
                bucketName: "pdfFiles",
                filename: file.originalname + '_file_' + Date.now(),
            };
        } else {
            console.log("Enter correct input files")
            return null
        }
    }
});

module.exports = multer({ storage });