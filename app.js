//get external modules
var fr = require('fs');
var express = require('express');
var app = express();
var mul = require('multer');
//get my modules
var convert_HTML = require('./project_modules/convert_html');
var logging = require('./project_modules/logging');
var add_log = logging.add_log;
var convertHTML = convert_HTML.convertHTML;
//for recieving file from client
//specifies where to store the file and the name it should have
var storage = mul.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './externalfile');
    },
    filename: function (req, file, cb) {
        cb(null, 'uploaded_file.docx');
    }
});
//post api request
app.post('/', mul({ storage: storage }).single('file'), function (req, res) {
    try {
        //name input into from from client - the folder name
        var folder_name = req.body.folder_name;
        //folder name validation - ensuring in only has letters and numbers
        for (var i = 0; i < folder_name.length; i++) {
            var ascii = folder_name.charCodeAt(i);
            if (ascii < 48 || (ascii > 57 && ascii < 65) || (ascii > 90 && ascii < 97) || ascii > 122) {
                add_log("ERROR", "File uploaded is not a .docx file or is empty");
                //respond with error
                res.sendFile(__dirname + "/public/fail.html");
                add_log("SUCCESS", "Sent page reporting error with upload to " + req.ip);
                return;
            }
        }
        //check files has been uploaded and name exists
        if (req.file == null || req.file.originalname.length < 5 || req.file.originalname.substring(req.file.originalname.length - 5, req.file.originalname.length) != ".docx" || folder_name.length < 3 || folder_name.length > 25) {
            add_log("ERROR", "File uploaded is not a .docx file or is empty");
            //respond with error
            res.sendFile(__dirname + "/public/fail.html");
            add_log("SUCCESS", "Sent page reporting error with upload to " + req.ip);
        }
        else {
            var save_path = "./SavedHTMLFiles/" + folder_name;
            //create new folder for html file - remove old one if it exists
            if (fr.existsSync(save_path)) {
                fr.rmdirSync(save_path, { recursive: true });
            }
            fr.mkdirSync(save_path);
            //perform html conversion and send a response
            var html_code = convertHTML(req, res, save_path);
            // add_log("SUCCESS", "Converted .docx file to html");
            add_log("SUCCESS", "called function to create html file");
        }
    }
    catch (err) {
        //if any errors happen during the process - gives error
        add_log("ERROR", err.toString() + ", on api post");
        res.send("An Error has occured");
    }
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
    add_log("SUCCESS", "Sent index page to " + req.ip);
});
app.listen(3000, function () { return console.log("listening..."); });
