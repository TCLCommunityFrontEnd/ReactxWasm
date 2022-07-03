import * as React from 'react';
import {base64_script} from '../workers/index';
const b64 = require('base64-wasm')

interface CompProps{
    getInstance:()=>Promise<{}>
}

const Base64  = (props:CompProps) => {
    const {getInstance} = props;
    const [originText,setOriginText] = React.useState();
    const [jsResult,setJsResult] = React.useState({beg:'',end:'',result:''});
    const [wasmResult,setWasmResult] = React.useState({beg:'',end:'',result:''});
    React.useEffect(()=>{
        if(originText!==undefined&&originText!==''){
            calcByJSWorker(originText);
            calcByWASM(originText);
        }
    },[originText]);
    React.useEffect(()=>{
        const inputFile = document.querySelector('#upload');
        inputFile.addEventListener('input',function(e:any){
            origin = e.target.files[0];
            readFile(origin,'text').then((text)=>{
                setOriginText(text);
            })
        });
    },[])
    function calcByWASM(text:string){
        getInstance().then((instance:any)=>{
            const {  __retain, __new, __release,__newString,__getString} = instance.exports
            const { getBase64, Base64 } = instance.exports
            const Base64Ptr = getBase64()
            const base64 = Base64.wrap(Base64Ptr)
            let result = '';
            const textPtr = __retain(__newString(text))
            const beg = performance.now()
            const outputPtr = base64.encode(textPtr)
            const end = performance.now();
            result = __getString(outputPtr)
            __release(textPtr)
            __release(outputPtr)
            __release(Base64Ptr)
            setWasmResult({beg,end,result});
        })
        // b64.ready((err) => {
        //     const message = Buffer.from(text)
        //     const encoded = b64.encode(message)
        //     const beg = performance.now()
        //     const result = encoded.toString()
        //     const end = performance.now();
        //     setWasmResult({beg,end,result});
        //   })
    }
    function calcByJSWorker(text:string){
        let worker = new Worker(base64_script);
        worker.postMessage(text);
        worker.onmessage = function(e){
          const {_beg,_end,_result} = e.data;
          setJsResult({beg:_beg,end:_end,result:_result});
        }
    }
    function readFile(file,type){
        var reader = new FileReader();
        return new Promise((resolve)=>{
            switch(type){
                case 'text':
                    reader.readAsText(file);
                    break;
                case 'dataUrl':
                    reader.readAsDataURL(file);
                    break;
                case 'arraybuffer':
                    reader.readAsArrayBuffer(file);
                    break;
            }
            reader.onload = function(e){
                resolve(this.result);
            }
        })
    }
    return (
        <>
            <input type="file" id="upload"/>
            <div >
                <div className="Calc-fib-by-js">
                    <p>JS计算：<span>{jsResult.end-jsResult.beg}ms</span></p>
                    <div className="ellipse">{jsResult.result}</div>
                </div>
                <div className="Calc-fib-by-wasm">
                    <p>WASM计算：<span>{wasmResult.end-wasmResult.beg}ms</span></p>
                    <div className="ellipse">{wasmResult.result}</div>
                    {/* {
                    wasmResult.result.map((value, index)=>{
                        return <div key={index}>fib({index}) = {value}</div>
                    })
                    } */}
                </div>
            </div>
        </>
    )
}

export default Base64;