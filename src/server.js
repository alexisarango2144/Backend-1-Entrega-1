import express from "express";



import apiRouter from "./routes/index.js";

const server = express();
const port = 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api', apiRouter);

server.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
});
