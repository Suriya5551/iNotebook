const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017"

const connectToMongo = ()=> {
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI, ()=>{
        console.log('connected to mongoDB')
    })
}

module.exports = connectToMongo;