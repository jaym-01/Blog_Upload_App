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
                logging.add_log("ERROR", "Generating HTML file: " + message);
            });
        }
    })
        .catch(function (error) {
        logging.add_log("ERROR", error.toString());
        html = "";
    });
    return html;
}
exports.convertHTML = convertHTML;
