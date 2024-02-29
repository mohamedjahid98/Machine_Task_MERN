const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const SignupSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    username: String,
    email: { type: String, unique: true },
    password: String,
    confirmpassword: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

SignupSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});

const SignupModel = mongoose.model("Signup", SignupSchema);

module.exports = SignupModel;
