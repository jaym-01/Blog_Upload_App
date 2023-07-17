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

        let ascii = folder_name.charCodeAt(i);

        if(ascii < 48 || (ascii > 57 && ascii < 65) || (ascii > 90 && ascii < 97) || ascii > 122){
            add_log("ERROR", "File uploaded is not a .docx file or is empty");
    
            //respond with error
            res.sendFile(__dirname + "/public/fail.html")
            add_log("SUCCESS", "Sent page reporting error with upload to " + req.ip);

            return;
        }
    } 

    try{
        if(req.file == null || req.file.originalname.length < 5 || req.file.originalname.substring(req.file.originalname.length - 5, req.file.originalname.length) != ".docx" || folder_name.length < 3 || folder_name.length > 25){
            // console.log("ERROR");//log it in log file
            add_log("ERROR", "File uploaded is not a .docx file or is empty");
    
            //respond with error
            res.sendFile(__dirname + "/public/fail.html")
            add_log("SUCCESS", "Sent page reporting error with upload to " + req.ip);
        }
        else{
            var save_path = "./SavedHTMLFiles/" + folder_name;

            if(fr.existsSync(save_path)){
                fr.rmdirSync(save_path, {recursive: true});
            }
            fr.mkdirSync(save_path);

            var html_code = convertHTML(req, res, save_path);
            // add_log("SUCCESS", "Converted .docx file to html");
            add_log("SUCCESS", "called function to create html file");
        }
    }
    catch(err){
        add_log("ERROR", err.toString() + ", on api post");
        res.send("An Error has occured");
    }
    
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/public/index.html");
    add_log("SUCCESS", "Sent index page to " + req.ip);
});

app.listen(3000, function () { return console.log("listening..."); });