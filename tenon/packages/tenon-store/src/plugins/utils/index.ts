import {OperationType, Operation, Operations} from './types'
/**
 * 对象的Diff操作
 * @param left Origin Object
 * @param right Target Object
 */
export function diff(left:Record<string, any>, right:Record<string, any>, parentKey:Array<string> = []):Operations{
  let ops:Operations = []
  Object.keys(left).forEach(key => {
    if(!right.hasOwnProperty(key)){
      // Delete Attr
      ops.push(createOperation(OperationType.DELETE, [...parentKey, key]))
      return
    }
    if(isObject(left[key]) && isObject(right[key])){
      // Deep Diff Object
      if(!isEqual(left[key], right[key])){
        ops.push(createOperation(OperationType.UPDATE, [...parentKey, key], right[key])) 
      }
      // let diffOps = diff(left[key], right[key], [...parentKey, key]);
      // diffOps.forEach(op => {
      //   ops.push(op)
      // })
    }else {
      if(left[key] !== right[key]){
        ops.push(createOperation(OperationType.UPDATE, [...parentKey, key], right[key]))
      }
    }
    
  })

  Object.keys(right).forEach(key => {
    if(!left.hasOwnProperty(key)){
      // Add Attr
      ops.push(createOperation(OperationType.ADD, [...parentKey,key], right[key]))
    }
  })  
  return ops
}

export function createOperation(type:OperationType, key:Array<string>, value?:any):Operation{
  return {
    type:type,
    key: key,
    value: value 
  }
}

function isObject(x:any):Boolean{
  return Object(x) === x
}

// 对象间比较，判断引用是否更改，同Vue的校验
function isEqual(left:object, right:object):boolean{
  // return JSON.stringify(left) === JSON.stringify(right)
  return left === right
}

// Common Clone Object
export function cloneObject(source: object):object{
  return Object.assign({}, source)
}