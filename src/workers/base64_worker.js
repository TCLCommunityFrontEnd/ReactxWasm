const workercode = () => {
    function encode(input){
        const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1 , chr2 , chr3 , enc1 , enc2 , enc3 , enc4 ;
        var i = 0;
    
        input = _utf8_encode(input);
    
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
    
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
    
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
    
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        } // Whend 
    
        return output;
    }
    function _utf8_encode(string) {
        var utftext = "";
    
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
    
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
    
        } // Next n 
    
        return utftext;
    }
    
    onmessage = (event) => {
        let _result = '';
        const _beg = performance.now();
        _result = encode(event.data);
        const _end = performance.now();
        postMessage({
            _beg,_end,_result
        });
    }
}



let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));
 
const blob = new Blob([code], {type: "application/javascript"});
const base64_script = URL.createObjectURL(blob);
 
export default base64_script;