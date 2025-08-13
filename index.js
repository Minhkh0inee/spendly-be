const express = require('express')
const dotenv = require('dotenv')
const dbInit = require('./db/mongo_init')
const morgan = require("morgan")
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser")
const cors = require('cors')
dotenv.config()

const userRoute = require("./routes/user.route")
const uploadRoute = require("./routes/upload.route")
const authRoute = require("./routes/auth.route")
const projectRoute = require("./routes/project.route")
const categoryRoute = require("./routes/category.route")

const app = express();
dbInit.initMongoDB()
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser());

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/api/users", userRoute)
app.use("/api/upload", uploadRoute)
app.use("/api/auth", authRoute)
app.use("/api/projects", projectRoute)
app.use("/api/categories", categoryRoute)



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});