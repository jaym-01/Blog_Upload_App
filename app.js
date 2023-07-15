var mammoth = require('mammoth');
var fr = require('fs');
var express = require('express');
var app = express();
var file_up = require('express-fileupload');
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
function getHTML() {
    mammoth.convertToHtml({ path: "test.docx" }, options)
        .then(function (result) {
        var html = result.value;
        if (result.messages > 0) {
            console.log("[ERROR] | *time* | *each message - its an array*"); // put it in a log file
        }
        ;
        return html;
    })
        .catch(function (error) {
        console.error(error);
    });
}

// app.use(file_up());
app.post('/api/upload', file_up(), function (req, res) {
    console.log(req.files.file)
    if(req.files == null || req.files.file.name.length < 5 || req.files.file.name.substring(req.files.file.name.length - 5, req.files.file.name.length) != ".docx"){
        console.log("ERROR");//log it in log file
        //respond with error
        res.redirect("/");
    }
    else{
        // console.log(req.files)
        fr.writeFileSync("./uploadtest.docx", req.files.file.data)
    }
});
app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(3000, function () { return console.log("listening..."); });
