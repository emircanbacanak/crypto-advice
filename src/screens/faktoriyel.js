export const faktoriyel  = value =>{
    let f = 1;
    for (let index = 1; index < value; index++) {
        f*=index;
    }
    return f;
};
