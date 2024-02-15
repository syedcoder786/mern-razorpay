const express = require('express');
const path = require('path');
const cors = require('cors');


const app = express();

//bodyParser middleware
app.use(express.json());
app.use(cors());


//routes
app.use('/payment',require('./routes/razerPayment'));


//Serve static asserts if in production
if(process.env.NODE_ENV === 'production'){
    //Set static folder
    app.use(express.static('client/build'));
    

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 5000 ;
app.listen(port, ()=>{ console.log(`server running on port ${port}`)} );