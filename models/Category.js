const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Delete all products when category is deleted
categorySchema.pre('remove', async function(next) {
    await this.model('Product').deleteMany({ category: this._id });
    next();
});

module.exports = mongoose.model('Category', categorySchema);
