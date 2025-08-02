const express = require('express')
const dotenv = require('dotenv')
const dbInit = require('./db/mongo_init')
const userRoute = require("./routes/user.route")
const morgan = require("morgan")
const bodyParser = require("body-parser")
dotenv.config()

const app = express();
dbInit.initMongoDB()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const port = 3000;


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/api/users", userRoute)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});