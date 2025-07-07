const mongoose = require('mongoose')

const connectDB = async () => {

    try {
        
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected Successfully !! ${connect.connection.host}`)
    } catch (error) {
        console.log(error.message);
        process.exit(1);
        
    }
}

module.exports = connectDB  