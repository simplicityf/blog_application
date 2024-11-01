const {check, param} = require("express-validator");
const mongoose = require("mongoose");


const addPostValidator = [
    check("desc").notEmpty().withMessage("Description is required"),
    check("file").custom(async (file) => {
        if(file && !mongoose.Types.ObjectId.isValid(file)) {
            throw "Invalid File Id"
        }
    }),
    check("category").custom(async (category) => {
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            throw "Invalid category Id";
        }
    }),
];

const updatePostValidator = [
    check("desc").notEmpty().withMessage("Description is required"),
    check("file").custom(async (file) => {
        if(file && !mongoose.Types.ObjectId.isValid(file)) {
            throw "Invalid File Id"
        }
    }),
    check("category").custom(async (category) => {
        if(category && !mongoose.Types.ObjectId.isValid(category)) {
            throw "Invalid category Id"
        }
    }),
];

const postIdValidator = [
    param("id").custom(async (id) => {
        if(id && !mongoose.Types.ObjectId.isValid(id)) {
            throw "Invalid Post Id"
        }
    })
]

module.exports = { addPostValidator, updatePostValidator, postIdValidator }