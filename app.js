//====================================================//
//==========core packeges ============================//
const express = require('express')
const cors = require('cors')
//====================================================//
//=========== Routes =================================//

const userRoute = require('./routes/authRouter')
const orderRoute = require('./routes/orderRouter')
const ProductRoute = require('./routes/productRouter')
const inValidOrederRoute =require('./routes/inValidOrderRouter')
//===================================================//
//============== meddlewares ========================//

const { globalHandleError,requestTime } = require('./meddlewares')


//===================================================//
//============== other =============================//

const corsOptions = require('./config/corsConfig')

//=================================================//
//=============== app logic ======================//

const app = express()
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions))
app.use(requestTime)
//    ROUTES    //

app.use('/api/user',userRoute)
app.use('/api/order',orderRoute)
app.use('/api/invalidOrder',inValidOrederRoute)
app.use('/api/products',ProductRoute)
//==============//
// handling routes not found error
app.all('*',(req,res,next)=>{
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err)
})
// handling all types of mongoDb error and api error
app.use(globalHandleError)

module.exports = app;