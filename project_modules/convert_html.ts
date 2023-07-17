const mammoth = require('mammoth');
const logging = require('./logging')
const fr = require('fs');

function convertHTML(req, res, save_path:string):void{
    var options = {
        convertImage: mammoth.images.imgElement(function (image) {
            return image.readAsBuffer().then(function (imageBuffer) {
    
                //stored as number of miliseconds since jan 1 1970 at 00:00:00
                let d = new Date();
                let img_path = save_path.substring(1, save_path.length) + "/" + d.getDate() + d.getMonth() + d.getFullYear() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds() + ".jpg";
    
                fr.writeFileSync("." + img_path, imageBuffer);
                return {
                    src: img_path,
                    class: "img-fluid"
                };
            });
        })
    };

    mammoth.convertToHtml({path: "./externalfile/uploaded_file.docx"}, options)
    .then(function(result){

        let html = result.value;
        let messages = result.messages;

        if(messages.length > 0){

            messages.forEach(message => {
                logging.add_log("ERROR", "Generating HTML file: " + message);
            });

        }

        //create html file
        var all_html = `
    <html>
        <head>
            <link rel="stylesheet" href="/styles.css">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
            <script src="/stnd_cmps.js" type="text/javascript"></script>
            <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            <script src="/Contact-Me/rr.js"></script><meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div class="container-fluid">
                <main-head></main-head>
                <script src="/index.js"></script>
                <div class="container-fluid page-body mt-5 mb-5">
                    ` + html + ` 
                </div>
                <main-foot></main-foot>
            </div>
        </body>
    </html>`;
        fr.writeFileSync(save_path + "/blog.html", all_html);
        logging.add_log("SUCCESS", "Saved HTML file");

        //delete the word file
        fr.rmSync("./externalfile/uploaded_file.docx")
        logging.add_log("SUCCESS", "Removed .docx file from local storage");

        //send response to the client
        res.sendFile(require('path').resolve('public/pass.html'))
        logging.add_log("SUCCESS", "Sent success page to " + req.ip);
    })
    .catch(function(error) {
        logging.add_log("ERROR", error.toString() + ", failed on convert to HTML");
        res.send("Error uploading file")
    });
}

export {convertHTML};