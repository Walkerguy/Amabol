const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    account_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});


const Ticket = mongoose.model('ticket', TicketSchema);

module.exports = Ticket;