const express = require("express");
const app = express();
const cor = require("cors");
const createProxyMiddleware = require("http-proxy-middleware");

app.use(cors())

app.get("/",createProxyMiddleware({target:"http://localhost:5001",changeOrigin:true}));

app.listen(3000,()=>{
    console.log("dsad");
})