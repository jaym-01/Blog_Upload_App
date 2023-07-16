var mammoth = require('mammoth');
var fr = require('fs');
const express = require('express');
const app = express();

var path = require('path');

const mul = require('multer');

const convert_HTML = require('./project_modules/convert_html')

const logging = require('./project_modules/logging');

const add_log = logging.add_log;
const convertHTML = convert_HTML.convertHTML;

const storage = mul.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './externalfile');
    },
    filename: function (req, file, cb) {
      cb(null, 'uploaded_file.docx');
    }
});

app.post('/', mul({storage: storage}).single('file'), function (req, res) {

    var folder_name:string = req.body.folder_name;

    //folder name validation - ensuring in only has letters and numbers
    for(let i = 0; i < folder_name.length; i++){

        let ascii = folder_name.charCodeAt(i)

        if(ascii < 48 || (ascii > 57 && ascii < 65) || (ascii > 90 && ascii < 97) || ascii > 122){
            add_log("ERROR", "File uploaded is not a .docx file or is empty");
    
            //respond with error
            res.sendFile(__dirname + "/public/fail.html")
            add_log("SUCCESS", "Sent page reporting error with upload to " + req.ip);

            return;
        }
    } 

    try{
        if(req.file == null || req.file.originalname.length < 5 || req.file.originalname.substring(req.files.file.name.length - 5, req.files.file.name.length) != ".docx" || folder_name.length < 3 || folder_name.length > 25){
            // console.log("ERROR");//log it in log file
            add_log("ERROR", "File uploaded is not a .docx file or is empty");
    
            //respond with error
            res.sendFile(__dirname + "/public/fail.html")
            add_log("SUCCESS", "Sent page reporting error with upload to " + req.ip);
        }
        else{
            var html_code = convertHTML();
            add_log("SUCCESS", "Converted .docx file to html");

            var all_html = '<html><head><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script><script src="/stnd_cmps.js" type="text/javascript"></script><script src="https://www.google.com/recaptcha/api.js" async defer></script><script src="/Contact-Me/rr.js"></script><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div class="container-fluid"><main-head></main-head><script src="/index.js"></script><div class="container-fluid page-body">' + html_code + '</div><main-foot></main-foot></div></body></html>';
            fr.writeFileSync("./SavedHTMLFiles/blog.html", all_html);
            add_log("SUCCESS", "Saved HTML file");

            fr.rmSync("./externalfile/uploaded_file.docx")
            add_log("SUCCESS", "Removed .docx file from local storage");

    
            res.sendFile(__dirname + "/public/pass.html")
            add_log("SUCCESS", "Sent success page to " + req.ip);
        }
    }
    catch(err){
        add_log("ERROR", err.toString());
        res.send("An Error has occured");
    }
    
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/public/index.html");
    add_log("SUCCESS", "Sent index page to " + req.ip);
});

app.listen(3000, function () { return console.log("listening..."); });