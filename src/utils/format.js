export default {
    number(data, symbolBefore = '', symbolAfter = '', prec = 0){
        data = parseFloat(data);
        if(parseInt(prec) === 0) {
            data = Math.floor(data);
        } else {
            data = data.toFixed(parseInt(prec));
        }
        data += '';
        var x = data.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return `${symbolBefore}${x1}${x2}${symbolAfter}`;
    }
}