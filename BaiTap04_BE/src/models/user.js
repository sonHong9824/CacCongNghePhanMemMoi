const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    viewed: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            viewedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Users = mongoose.model('Users', userSchema);

module.exports = Users;