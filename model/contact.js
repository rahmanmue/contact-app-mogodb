const mongoose = require('mongoose')
const contactSchema = new mongoose.Schema({
    nama: {
        type :String,
        required :true,
    },
    noHp: String
})

const Contact = mongoose.model('contact', contactSchema )

module.exports = Contact;