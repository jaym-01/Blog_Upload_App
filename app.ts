const mammoth = require('mammoth');
var fr = require('fs');

var options:object = {
    convertImage: mammoth.images.imgElement(function(image) {
        return image.readAsBuffer().then(function(imageBuffer){
            fr.writeFileSync('./new_test1.jpg', imageBuffer);
            return {
                src: "/new_test1.jpg",
                class: "img-fluid"
            };
        });
    })
};

mammoth.convertToHtml({path: "test.docx"}, options)
.then(function(result){
    var html = result.value; // The generated HTML
    var messages = result.messages; // Any messages, such as warnings during conversion
    console.log(typeof messages)
})
.catch(function(error) {
    console.error(error);
});