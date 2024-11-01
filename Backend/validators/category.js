const {check, param} = require("express-validator");
const mongoose = require("mongoose");

// Category post validation
const addCategoryValidator = [
    check("title").notEmpty().withMessage("Title is required"),
];

const idVAlidator = [
    param("id").custom(async (id) => {
        if(id && !mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid id");
        }
    })
]

module.exports = { addCategoryValidator, idVAlidator }