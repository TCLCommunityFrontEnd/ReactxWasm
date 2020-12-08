import * as React from 'react';
import {worker_script} from './workers/index.ts';
import loader from "@assemblyscript/loader"; // or require

import './App.css';

//这个加在方法无法获取辅助函数
function loadWebAssembly(filename, imports = {}) {
  return fetch(filename)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      imports.env = imports.env || {}
      Object.assign(imports.env, {
        abort: (_msg, _file, line, column) => {
          console.error("abort called at index.ts:" + line + ":" + column);
        },
        memoryBase: 0,
        tableBase: 0,
        __memory_base: 0,
        __table_base: 0,
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' })
      })
      return WebAssembly.instantiate(buffer, imports)
    })
    .then(result => {console.log(result);return result} )
}
function _loadWebAssembly(filename,imports = {}){
  return loader.instantiate(fetch(filename),imports);
}

function App(){
  const [jsResult,setJsResult] = React.useState({beg:'',end:'',result:[]});
  const [wasmResult,setWasmResult] = React.useState({beg:'',end:'',result:[]})
  
  function calcByJSWorker(){
    let worker = new Worker(worker_script);
    worker.onmessage = function(e){
      const {_beg,_end,_result} = e.data;
      setJsResult({beg:_beg,end:_end,result:_result});
    }
  }

  function calcByWASM(){
    _loadWebAssembly('./wasm/module.optimized.wasm').then(instance => {
      const { fib } = instance.exports ;
      let result = [];
      const beg = performance.now()
      for (let i = 0; i <= 40; ++i) {
        result[i] = fib(i)
      }
      const end = performance.now()
      setWasmResult({beg,end,result});


      const text = '年轻人不讲武德';
      const {  __retain, __new, __release,__newString,__getString} = instance.exports
      const { getBase64, Base64 } = instance.exports
      const Base64Ptr = getBase64()
      const base64 = Base64.wrap(Base64Ptr)
      for(let i = 0;i<10000;i++) {
        const textPtr = __retain(__newString(text))
        const outputPtr = base64.encode(textPtr)
        console.log(__getString(outputPtr))
        __release(textPtr)
        __release(outputPtr)
      }
      __release(Base64Ptr)
    })
  }
  function handleClick(){
    calcByJSWorker();
    calcByWASM();
  }
  return (
    <React.Fragment>
      <button onClick={handleClick}>Test</button>
      <div className="App-container">
        <div className="Calc-fib-by-js">
          <p>JS计算：<span>{jsResult.end-jsResult.beg}ms</span></p>
          {
            jsResult.result.map((value, index)=>{
              return <div key={index}>fib({index}) = {value}</div>
            })
          }
        </div>
        <div className="Calc-fib-by-wasm">
          <p>WASM计算：<span>{wasmResult.end-wasmResult.beg}ms</span></p>
          {
            wasmResult.result.map((value, index)=>{
              return <div key={index}>fib({index}) = {value}</div>
            })
          }
        </div>
      </div>
    </React.Fragment>
  )
}
export default App;
