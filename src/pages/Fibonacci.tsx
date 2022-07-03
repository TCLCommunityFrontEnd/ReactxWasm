import * as React from 'react';
import {worker_script} from '../workers/index';
import {Button} from 'antd';

interface CompProps{
    getInstance:()=>Promise<{}>
}

const Fibonacci = (props:CompProps) => {
    const {getInstance} = props;
    const [jsResult,setJsResult] = React.useState({beg:'',end:'',result:[]});
    const [wasmResult,setWasmResult] = React.useState({beg:'',end:'',result:[]});

    function calcByJSWorker(){
        let worker = new Worker(worker_script);
        worker.onmessage = function(e){
          const {_beg,_end,_result} = e.data;
          setJsResult({beg:_beg,end:_end,result:_result});
        }
    }
    function calcByWASM(){
        getInstance().then((instance:any) => {
            const { fib } = instance.exports ;
            let result = [];
            const beg = performance.now()
            for (let i = 0; i <= 40; ++i) {
              result[i] = fib(i)
            }
            const end = performance.now()
            setWasmResult({beg,end,result});
        });
    }
    function handleClick(){
        calcByJSWorker();
        calcByWASM();
    }
    return (
        <>
            <Button onClick={handleClick}>开始计算</Button>
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
        </>
    )
}

export default Fibonacci;