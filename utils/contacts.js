const fs = require('node:fs');

// cek folder
const dirPath = './data'
const dataPath = `${dirPath}/contacts.json`

if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath,'[]', 'utf-8')
}

const loadContact = () => {
    const file = fs.readFileSync(dataPath, 'utf-8');
    const contacts = JSON.parse(file)
    return contacts
}


const findContact = (nama) =>{
    const contacts = loadContact();
    const result = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())

    return result

}

const addContact = (contact) =>{
    const contacts = loadContact()
    contacts.push(contact)

    // masukan dan ubah jadi string
    fs.writeFileSync(dataPath, JSON.stringify(contacts))
}

const cekDuplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find((contact)=> contact.nama === nama)
}

const deleteContact = (nama) => {
    contacts = loadContact()

    const filteredContact = contacts.filter((x) => x.nama !== nama)

     // masukan dan ubah jadi string
     fs.writeFileSync(dataPath, JSON.stringify(filteredContact))

}

const updateContacts = (contactBaru) => {
    contacts = loadContact()

    const filteredContact = contacts.filter((x) => x.nama !== contactBaru.oldName)
    delete contactBaru.oldName
    filteredContact.push(contactBaru)

    // masukan dan ubah jadi string
    fs.writeFileSync(dataPath, JSON.stringify(filteredContact))


}

module.exports = {
    loadContact,
    findContact,
    addContact,
    cekDuplikat, 
    deleteContact,
    updateContacts
}