const express = require("express");
const cors = require("cors");

class App {
    constructor() {
        this.server = express();
        this.server.use(cors());
    }
}

new App().server;