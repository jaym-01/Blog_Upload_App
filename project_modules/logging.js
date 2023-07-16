"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_log = void 0;
var fr = require('fs');
function add_log(type, message) {
    var log_file = fr.createWriteStream("./server.log", { flags: 'a' });
    log_file.write((new Date()).toString() + " | Blog Upload | [" + type + "] | " + message + "\n");
    log_file.end();
}
exports.add_log = add_log;
