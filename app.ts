var mammoth = require('mammoth');
var fr = require('fs');
const express = require('express');
const app = express();
var file_up = require('express-fileupload');
var path = require('path');

var options = {
    convertImage: mammoth.images.imgElement(function (image) {
        return image.readAsBuffer().then(function (imageBuffer) {

            //stored as number of miliseconds since jan 1 1970 at 00:00:00
            let img_path = "./" + (new Date()).getTime().toString() + ".jpg";

            fr.writeFileSync(img_path, imageBuffer);
            return {
                src: img_path,
                class: "img-fluid"
            };
        });
    })
};


app.post('/', file_up(), function (req, res) {

    if(req.files == null || req.files.file.name.length < 5 || req.files.file.name.substring(req.files.file.name.length - 5, req.files.file.name.length) != ".docx"){
        console.log("ERROR");//log it in log file

        //respond with error
        res.sendFile(__dirname + "/public/fail.html")
        
    }
    else{
        // console.log(req.files)
        fr.writeFileSync("./uploadtest.docx", req.files.file.data)

        res.sendFile(__dirname + "/public/pass.html")
    }
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(3000, function () { return console.log("listening..."); });