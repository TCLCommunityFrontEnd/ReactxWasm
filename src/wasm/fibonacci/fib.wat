(module
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (export "fib" (func $fib))
 (func $fib (; 0 ;) (param $n i32) (result i32)
  (if
   (i32.lt_s
    (local.get $n)
    (i32.const 2)
   )
   (return
    (local.get $n)
   )
  )
  (return
   (i32.add
    (call $fib
     (i32.sub
      (local.get $n)
      (i32.const 2)
     )
    )
    (call $fib
     (i32.sub
      (local.get $n)
      (i32.const 1)
     )
    )
   )
  )
 )
)
