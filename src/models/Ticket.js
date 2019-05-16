const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    account:{
        id:{
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: { 
            type: String,
            required: true
        }
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