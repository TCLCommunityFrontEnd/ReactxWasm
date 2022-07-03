import * as React from 'react';
import loader from "@assemblyscript/loader"; // or require
import Fibonacci from './pages/Fibonacci.tsx';
import Base64 from './pages/Base64.tsx';
import './App.css';
import {Tabs,Typography} from 'antd';
const {TabPane} = Tabs;

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
  // function calcByWASM(){
  //   _loadWebAssembly('./wasm/module.optimized.wasm').then(instance => {
  //     const { fib } = instance.exports ;
  //     let result = [];
  //     const beg = performance.now()
  //     for (let i = 0; i <= 40; ++i) {
  //       result[i] = fib(i)
  //     }
  //     const end = performance.now()
  //     setWasmResult({beg,end,result});


  //     const text = '年轻人不讲武德';
  //     const {  __retain, __new, __release,__newString,__getString} = instance.exports
  //     const { getBase64, Base64 } = instance.exports
  //     const Base64Ptr = getBase64()
  //     const base64 = Base64.wrap(Base64Ptr)
  //     for(let i = 0;i<10000;i++) {
  //       const textPtr = __retain(__newString(text))
  //       const outputPtr = base64.encode(textPtr)
  //       console.log(__getString(outputPtr))
  //       __release(textPtr)
  //       __release(outputPtr)
  //     }
  //     __release(Base64Ptr)
  //   })
  // }
  function getWebassemblyInstance(){
    return loader.instantiate(fetch('./wasm/module.optimized.wasm'),{});
  }
  return (
    <div style={{padding:16}}>
      <Typography.Title>WebAssembly示例</Typography.Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="菲波那契数列" key="1">
          <Fibonacci getInstance={getWebassemblyInstance}/>
        </TabPane>
        <TabPane tab="Base64转码" key="2">
          <Base64 getInstance={getWebassemblyInstance}/>
        </TabPane>
      </Tabs>
    </div>
  )
}
export default App;
