"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHTML = void 0;
var mammoth = require('mammoth');
var logging = require('./logging');
var fr = require('fs');
var options = {
    convertImage: mammoth.images.imgElement(function (image) {
        return image.readAsBuffer().then(function (imageBuffer) {
            //stored as number of miliseconds since jan 1 1970 at 00:00:00
            var d = new Date();
            var img_path = "/SavedHTMLFiles/" + d.getDate() + d.getMonth() + d.getFullYear() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds() + ".jpg";
            fr.writeFileSync("." + img_path, imageBuffer);
            return {
                src: img_path,
                class: "img-fluid"
            };
        });
    })
};
function convertHTML(req, res) {
    mammoth.convertToHtml({ path: "./externalfile/uploaded_file.docx" }, options)
        .then(function (result) {
        var html = result.value;
        var messages = result.messages;
        if (messages.length > 0) {
            messages.forEach(function (message) {
                logging.add_log("ERROR", "Generating HTML file: " + message);
            });
        }
        //create html file
        var all_html = "\n    <html>\n        <head>\n            <link rel=\"stylesheet\" href=\"/styles.css\">\n            <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css\">\n            <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM\" crossorigin=\"anonymous\">\n            <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz\" crossorigin=\"anonymous\"></script>\n            <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js\"></script>\n            <script src=\"/stnd_cmps.js\" type=\"text/javascript\"></script>\n            <script src=\"https://www.google.com/recaptcha/api.js\" async defer></script>\n            <script src=\"/Contact-Me/rr.js\"></script><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        </head>\n        <body>\n            <div class=\"container-fluid\">\n                <main-head></main-head>\n                <script src=\"/index.js\"></script>\n                <div class=\"container-fluid page-body mt-5 mb-5\">\n                    " + html + " \n                </div>\n                <main-foot></main-foot>\n            </div>\n        </body>\n    </html>";
        fr.writeFileSync("./SavedHTMLFiles/blog.html", all_html);
        logging.add_log("SUCCESS", "Saved HTML file");
        //delete the word file
        fr.rmSync("./externalfile/uploaded_file.docx");
        logging.add_log("SUCCESS", "Removed .docx file from local storage");
        //send response to the client
        res.sendFile(require('path').resolve('public/pass.html'));
        logging.add_log("SUCCESS", "Sent success page to " + req.ip);
    })
        .catch(function (error) {
        logging.add_log("ERROR", error.toString() + ", failed on convert to HTML");
        res.send("Error uploading file");
    });
}
exports.convertHTML = convertHTML;
