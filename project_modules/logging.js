"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_log = void 0;
var fr = require('fs');
function add_log(type, message) {
    // let log_file = fr.createWriteStream("./server.log", { flags: 'a' });
    // log_file.write((new Date()).toString() + " | Blog Upload | [" + type + "] | " + message + "\n");
    // log_file.end();
    var logs = fr.readFileSync("./server.log");
    logs += (new Date()).toString() + " | Blog Upload | [" + type + "] | " + message + "\n";
    fr.writeFileSync("./server.log", logs);
}
exports.add_log = add_log;
