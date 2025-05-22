const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        color: { type: String, default: "#ffffff" },
    },
    { timestamps: true }
);


const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        notes: [NoteSchema],
    }, 
    {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);