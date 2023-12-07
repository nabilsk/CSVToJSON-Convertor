//environment variables
require("dotenv").config();
//catch all async errors
require("express-async-errors");

//third party packages
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const fileUpload = require("express-fileupload");

//database connection function
const { connectDB } = require("./db/connect");

//custom middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routers
const usersRouter = require("./routes/usersRoute");

//initialize express app
const app = express();

//security middleware
//helps with ips behind proxies
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(cors());
app.use(helmet());
app.use(xss());

app.use(express.json());
app.use(express.static("public"));
//logging
app.use(morgan("tiny"));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//routes
app.use("/api/v1/users", usersRouter);

//custom middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    //connect to database
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (err) {
    console.log(`Server could not start with error: ${err.message}`);
  }
};

//initialize server
start();
