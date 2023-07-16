function check_n_l(input:string, response:Function){
    for(let i = 0; i < input.length; i++){

        let ascii = input.charCodeAt(i)

        if(ascii < 48 || (ascii > 57 && ascii < 65) || (ascii > 90 && ascii < 97) || ascii > 122){
            response();
        }
    } 
}

export {check_n_l};