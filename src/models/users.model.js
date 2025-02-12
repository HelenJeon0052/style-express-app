const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        minLength: 5
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    kakaoId: {
        type: String,
        unique: true,
        sparse: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        default: 'First Name'
    },
    lastName: {
        type: String,
        default: 'Last Name'
    },
    bio: {
        type:String,
        default: 'dev'
    },
    followers:[{type:String}],
    followRequest:[{type:String}]
}, {timestampes:true})

const saltRounds = 10;
userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;