var mammoth = require('mammoth');
var fr = require('fs');
var express = require('express');
var app = express();
var file_up = require('express-fileupload');
var path = require('path');
var mul = require('multer');
function add_log(type, message) {
    var log_file = fr.createWriteStream("./server.log", { flags: 'a' });
    log_file.write((new Date()).toUTCString() + " | Blog Upload | [" + type + "] | " + message + "\n");
    log_file.end();
}
var options = {
    convertImage: mammoth.images.imgElement(function (image) {
        return image.readAsBuffer().then(function (imageBuffer) {
            //stored as number of miliseconds since jan 1 1970 at 00:00:00
            var d = new Date();
            var img_path = "./" + d.getDate() + d.getMonth() + d.getFullYear() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds() + ".jpg";
            fr.writeFileSync(img_path, imageBuffer);
            return {
                src: img_path,
                class: "img-fluid"
            };
        });
    })
};
function convertHTML() {
    var html = "";
    mammoth.convertToHtml({ path: "./uploaded_file.docx" }, options)
        .then(function (result) {
        html = result.value;
        var messages = result.messages;
        if (messages.length > 0) {
            messages.forEach(function (message) {
                add_log("ERROR", "Generating HTML file: " + message);
            });
        }
        return html;
    })
        .catch(function (error) {
        add_log("ERROR", error.toString());
        html = "";
    });
    return html;
}
var storage = mul.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './externalfile');
    },
    filename: function (req, file, cb) {
        cb(null, 'uploaded_file.docx');
    }
});
app.post('/', mul({ storage: storage }).single('file'), function (req, res) {
    console.log(req.file);
    console.log(req.body);
    res.send("test");
    return;
    try {
        if (req.files == null || req.files.file.name.length < 5 || req.files.file.name.substring(req.files.file.name.length - 5, req.files.file.name.length) != ".docx") {
            // console.log("ERROR");//log it in log file
            add_log("ERROR", "File uploaded is not a .docx file");
            //respond with error
            res.sendFile(__dirname + "/public/fail.html");
            add_log("SUCCESS", "Sent page reporting error with upload to " + req.ip);
        }
        else {
            // console.log(req.files)
            fr.writeFileSync("./uploaded_file.docx", req.files.file.data);
            add_log("SUCCESS", "Saved the .docx file locally");
            var html_code = convertHTML();
            add_log("SUCCESS", "Converted .docx file to html");
            var all_html = '<html><head><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script><script src="/stnd_cmps.js" type="text/javascript"></script><script src="https://www.google.com/recaptcha/api.js" async defer></script><script src="/Contact-Me/rr.js"></script><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div class="container-fluid"><main-head></main-head><script src="/index.js"></script><div class="container-fluid page-body">' + html_code + '</div><main-foot></main-foot></div></body></html>';
            fr.writeFileSync("./SavedHTMLFiles/blog.html", all_html);
            add_log("SUCCESS", "Saved HTML file");
            fr.rmSync("./uploaded_file.docx");
            add_log("SUCCESS", "Removed .docx file from local storage");
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
    add_log("SUCCESS", "Sent index page to " + req.ip);
});
app.listen(3000, function () { return console.log("listening..."); });
