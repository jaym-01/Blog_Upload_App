var mammoth = require('mammoth');
var fr = require('fs');

var options = {
    convertImage: mammoth.images.imgElement(function (image) {
        return image.readAsBuffer().then(function (imageBuffer) {
            fr.writeFileSync('./new_test1.jpg', imageBuffer);
            return {
                src: "/new_test1.jpg",
                class: "img-fluid"
            };
        });
    })
};
mammoth.convertToHtml({ path: "test.docx" }, options)
    .then(function (result) {
    var html = result.value; // The generated HTML


    if(result.messages > 0){
        console.log("[ERROR] | *time* | *each message - its an array*")
    };
})
    .catch(function (error) {
    console.error(error);
});
