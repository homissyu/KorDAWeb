function custom_sort(a, b, asc) {
    switch(typeof a){
        case Number:
            if(asc) return a - b;
            else return b - a;
            break;
        case String:
            break;
        case Date:
            if(asc) return new Date(a).getTime() - new Date(b).getTime();
            else return new Date(b).getTime() - new Date(a).getTime();
            break;
        default:
            if(asc) return a - b;
            else return b - a;
            break;
    }
}