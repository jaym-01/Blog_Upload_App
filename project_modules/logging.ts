const fr = require('fs');

function add_log(type:string, message:string) : void{
    // let log_file = fr.createWriteStream("./server.log", { flags: 'a' });
    // log_file.write((new Date()).toString() + " | Blog Upload | [" + type + "] | " + message + "\n");
    // log_file.end();

    let logs:string = fr.readFileSync("./server.log");
    logs += (new Date()).toString() + " | Blog Upload | [" + type + "] | " + message + "\n";
    fr.writeFileSync("./server.log", logs);
}

export {add_log};