const mongoose = require('mongoose');

const connectToMongo = ()=>{
    try {
        mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
          console.log("connected"));
      } catch (error) {
        console.log("could not connect");
      }
      
      const connection = mongoose.connection;
      connection.on('error', console.error.bind(console, 'connection error:'));
      connection.once('open', () => {
        console.log("MongoDB database connection established successfully");
      });
}

module.exports = connectToMongo;