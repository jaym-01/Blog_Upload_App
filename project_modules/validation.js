"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_n_l = void 0;
function check_n_l(input, response) {
    for (var i = 0; i < input.length; i++) {
        var ascii = input.charCodeAt(i);
        if (ascii < 48 || (ascii > 57 && ascii < 65) || (ascii > 90 && ascii < 97) || ascii > 122) {
            response();
        }
    }
}
exports.check_n_l = check_n_l;
