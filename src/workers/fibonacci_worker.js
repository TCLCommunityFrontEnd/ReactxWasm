const workercode = () => {
    function fibonacci(n){
        if(n==0)return 0
        else if(n==1)return 1
        else return fibonacci(n-1) + fibonacci(n-2)
    }
    let _result = [];
    const _beg = performance.now();
    for (let i = 0; i <= 40; ++i) {
    _result[i] = fibonacci(i)
    }
    const _end = performance.now();
    postMessage({
        _beg,_end,_result
    })
}


let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));
 
const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);
 
export default worker_script;