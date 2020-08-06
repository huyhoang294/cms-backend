const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require("passport");

const usersRouter = require('./routes/api/users');
const dashboardRouter = require('./routes/api/dashboard');
const appuserRouter = require('./routes/api/appuser');
const cabinetRouter = require('./routes/api/cabinet');
// const stationRouter = require('./routes/api/station');

require('dotenv').config();
require("./config/passport")(passport);

const app = express();
const port = process.env.PORT || 5000;

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const db = require("./config/keys").mongoURI;

mongoose.connect(db,
   { useUnifiedTopology: true,
    useNewUrlParser: true, 
    useCreateIndex: true,
    dbName: 'dhd'}
)
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));
console.log()
app.use(passport.initialize());
app.use('/api/users', usersRouter);
app.use('/api/dashboard', passport.authenticate('jwt', {session: false}), dashboardRouter);
app.use('/api/appuser', passport.authenticate('jwt', {session: false}), appuserRouter);
app.use('/api/cabinet', passport.authenticate('jwt', {session: false}), cabinetRouter);
// app.use('/api/dashboard',dashboardRouter);
// app.use('/api/appuser',appuserRouter);
// app.use('/api/cabinet',cabinetRouter);
// app.use('/api/station',stationRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
