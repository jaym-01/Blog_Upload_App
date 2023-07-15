var mammoth = require('mammoth');
var fr = require('fs');
var express = require('express');
var app = express();
var file_up = require('express-fileupload');
var path = require('path');
function add_log(type, message) {
    var log_file = fr.createWriteStream("./server.log", { flags: 'a' });
    log_file.write((new Date()).toUTCString() + " | Blog Upload | [" + type + "] | " + message + "\n");
    log_file.end();
}
var options = {
    convertImage: mammoth.images.imgElement(function (image) {
        return image.readAsBuffer().then(function (imageBuffer) {
            //stored as number of miliseconds since jan 1 1970 at 00:00:00
            var img_path = "./" + (new Date()).getTime().toString() + ".jpg";
            fr.writeFileSync(img_path, imageBuffer);
            return {
                src: img_path,
                class: "img-fluid"
            };
        });
    })
};
app.post('/', file_up(), function (req, res) {
    try {
        if (req.files == null || req.files.file.name.length < 5 || req.files.file.name.substring(req.files.file.name.length - 5, req.files.file.name.length) != ".docx") {
            // console.log("ERROR");//log it in log file
            add_log("ERROR", "File uploaded is not a .docx file");
            //respond with error
            res.sendFile(__dirname + "/public/fail.html");
            add_log("SUCCESS", "Sent page reporting error with upload");
        }
        else {
            // console.log(req.files)
            fr.writeFileSync("./uploadtest.docx", req.files.file.data);
            add_log("SUCCESS", "Saved the .docx file locally");
            // add_log("SUCCESS", "Converted .docx file to html");
            // add_log("SUCCESS", "Removed .docx file from local storage");
            res.sendFile(__dirname + "/public/pass.html");
            add_log("SUCCESS", "Sent success page to " + req.ip);
        }
    }
    catch (err) {
        add_log("ERROR", err.toString());
        res.send("An Error has occured");
    }
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
    add_log("SUCCESS", "Sent success page to " + req.ip);
});
app.listen(3000, function () { return console.log("listening..."); });
