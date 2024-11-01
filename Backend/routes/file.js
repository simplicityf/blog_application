const express = require("express");
const router = express.Router();
const validate = require("../validators/validate");
const {isAuth} = require("../middleware");
const  {upload}  = require("../middleware/upload");
const { fileController } = require("../controllers");

//Post a file
router.post("/upload", isAuth, upload.single('file'), fileController.uploadFile)

//view an file
router.get("/signed-url", isAuth, fileController.getFiles);

//Delete a file
router.delete("/delete", isAuth, fileController.deleteFile)


module.exports = router;