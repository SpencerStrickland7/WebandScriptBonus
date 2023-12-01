const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    Id:String,
    name: String,
    description: String,
    number: Number,
    email: String,
    technician: String,
    status: String
}, {
    collection: 'Ticket_db'
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;