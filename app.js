const express = require('express')
const app = express()
const port = 3000

const expressLayouts = require('express-ejs-layouts');

// const {loadContact, findContact,addContact, cekDuplikat, deleteContact, updateContacts} = require('./utils/contacts')


// koneksi db
require('./utils/db')
const Contact = require('./model/contact')


// override with the X-HTTP-Method-Override header in the request
const methodOverride = require('method-override')
app.use(methodOverride('_method'))


const {body, check, validationResult} = require('express-validator')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')


// gunakan ejs
app.set('view engine', 'ejs')

app.use(expressLayouts);

// built-in middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))



// konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge:6000},
    secret: 'secret',
    resave:true,
    saveUninitialized:true
}))
app.use(flash())



app.get('/', (req, res) => {
    const person = [
        {
            nama : 'salah',
            noHp : '11'
        },
        {
            nama : 'firmino',
            noHp : '9'
        }
    ]

    res.render('index', {
        layout : 'layouts/main-layout',
        title : 'index',
        nama:'man',
        person
    })
})

app.get('/contact', async (req, res) => {

    const contacts = await Contact.find()

    res.render('contact',{
        layout : 'layouts/main-layout',
        title : 'contact',
        contacts, 
        msg : req.flash('msg')
    })
})


app.get('/contact/add', (req, res) => {
    res.render('add-contact',{
        layout : 'layouts/main-layout',
        title : 'add contact',
    })
})

app.post('/contact', [
    body('nama').custom(async (value)=>{
        const duplikat = await Contact.findOne({nama:value})
        if(duplikat){
            throw new Error ('Nama kontak sudah digunakan')
        }
        return true
    }),
    check('noHp', 'nomor HP tidak valid!').isMobilePhone('id-ID')
],(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('add-contact', {
            layout : 'layouts/main-layout',
            title : 'add contact',
            errors : errors.array()
        })
    }else{
        Contact.insertMany(req.body)
        // kirim data flash
        req.flash('msg', 'Data berhasil ditambahkan')
        res.redirect('/contact')
    }
})


// app.get('/contact/delete/:nama', async (req, res)=>{
//     const contact = await Contact.findOne({nama:req.params.nama})

//     if(!contact){
//         res.status(404)
//         res.send('404')
//     }else{
//         Contact.deleteOne({_id : contact._id }).then((result)=>{
//             // kirim data flash
//             req.flash('msg', 'Data berhasil dihapus')
//             res.redirect('/contact')
//         })
//     }
// })


// DELETE 
app.delete('/contact', (req,res)=>{
    Contact.deleteOne({ _id : req.body._id }).then((result)=>{
        // kirim data flash
        req.flash('msg', 'Data berhasil dihapus')
        res.redirect('/contact')
    })
})



// UPDATE
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({nama:req.params.nama})

    res.render('edit-contact',{
        layout : 'layouts/main-layout',
        title : 'edit contact',
        contact
    })
})


app.put('/contact', [
    body('nama').custom(async (value, { req })=>{
        const duplikat = await Contact.findOne({nama:value})
        if(value !== req.body.oldName && duplikat){
            throw new Error ('Nama kontak sudah digunakan')
        }
        return true
    }),
    check('noHp', 'nomor HP tidak valid!').isMobilePhone('id-ID')
],(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('edit-contact', {
            layout : 'layouts/main-layout',
            title : 'edit contact',
            errors : errors.array(),
            contact: req.body
        })
    }else{
        Contact.updateOne({
            _id: req.body._id
        },{
            $set: {
                nama : req.body.nama,
                noHp: req.body.noHp
            }
        }).then((x)=>{
            // kirim data flash
            req.flash('msg', 'Data berhasil diubah')
            res.redirect('/contact')
        })
    }
})


app.post('/contact/update', (req,res)=>{
    res.send(req.body)
})


app.get('/contact/:nama', async (req, res) => {
   
    const contact = await Contact.findOne({nama:req.params.nama})

    res.render('detail',{
        layout : 'layouts/main-layout',
        title : 'detail contact',
        contact
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        layout : 'layouts/main-layout',
        title : 'about'
    })
})


app.use('/', (req,res)=>{
    res.status(404)
    res.send('404')
})


app.listen(port, ()=>{
    console.log(`Example port ${port}`)
})