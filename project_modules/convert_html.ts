const mammoth = require('mammoth');
const logging = require('./logging')
const fr = require('fs');

var options = {
    convertImage: mammoth.images.imgElement(function (image) {
        return image.readAsBuffer().then(function (imageBuffer) {

            //stored as number of miliseconds since jan 1 1970 at 00:00:00
            let d = new Date();
            let img_path = "./" + d.getDate() + d.getMonth() + d.getFullYear() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds() + ".jpg";

            fr.writeFileSync(img_path, imageBuffer);
            return {
                src: img_path,
                class: "img-fluid"
            };
        });
    })
};

function convertHTML():string{
    var html:string = "";

    mammoth.convertToHtml({path: "./uploaded_file.docx"}, options)
    .then(function(result){

        html = result.value;
        let messages = result.messages;

        if(messages.length > 0){

            messages.forEach(message => {
                logging.add_log("ERROR", "Generating HTML file: " + message);
            });

        }
    })
    .catch(function(error) {
        logging.add_log("ERROR", error.toString());
        html = "";
    });

    return html;
}

export {convertHTML};