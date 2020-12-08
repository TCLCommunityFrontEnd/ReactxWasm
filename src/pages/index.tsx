import * as React from 'react';
import {worker_script} from 'workers/index.js';
// import {loadWebAssembly} from './utils/loader.js';
import fib from '@/wasm/fibonacci/fib.wasm';

console.log(fib);
// import './App.css';

function App(){
  const [jsResult,setJsResult]:any = React.useState({beg:'',end:'',result:[]}); 
  function calcByJSWorker(){
    let worker = new Worker(worker_script);
    worker.onmessage = function(e){
      const {_beg,_end,_result} = e.data;
      setJsResult({beg:_beg,end:_end,result:_result});
    }
  }
  function calcByWASM(){
    // loadWebAssembly('./fib.wasm').then(instance => {
    //   const { fib } = instance.exports 
    // })
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
            jsResult.result.map((value:number, index:number)=>{
              return <div key={index}>fib({index}) = {value}</div>
            })
          }
        </div>
        <div className="Calc-fib-by-wasm">

        </div>
      </div>
    </React.Fragment>
  )
}
export default App;
