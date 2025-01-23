<template>
<h4>一、普通函数的 this 指向</h4>
<p>普通函数的 this 是动态绑定的，取决于调用方式。具体规则如下：</p>
<p>1. 默认绑定</p>
<p>在非严格模式下，this 默认指向全局对象（浏览器中是 window，Node.js 中是 global）。在严格模式下，this 会是 undefined。</p>
<code>
    <pre>function foo() {
  console.log(this);
}

// 非严格模式
foo(); // window (浏览器中)

// 严格模式
'use strict';
foo(); // undefined</pre>
</code>
<p>2. 隐式绑定</p>
<p>当函数作为某个对象的方法调用时，this 指向调用该函数的对象。</p>
<code>
    <pre>const obj = {
  name: "Alice",
  sayName: function () {
    console.log(this.name);
  },
};

obj.sayName(); // 输出: Alice (this 指向 obj)</pre>
</code>
<p>	如果将函数从对象中提取出来，this 会失去隐式绑定，回退到默认绑定。</p>
<code>
    <pre>const sayName = obj.sayName;
sayName(); // undefined 或抛出错误 (严格模式下 this 为 undefined)</pre>
</code>

<p>3. 显式绑定</p>
<p>通过 call、apply 或 bind 方法，可以显式地指定 this。</p>
<code>
    <pre>function greet(greeting) {
  console.log(`${greeting}, I am ${this.name}`);
}

const person = { name: "Bob" };
greet.call(person, "Hello"); // 输出: Hello, I am Bob
greet.apply(person, ["Hi"]); // 输出: Hi, I am Bob

const boundGreet = greet.bind(person);
boundGreet("Hey"); // 输出: Hey, I am Bob</pre>
</code>

<p>4. 构造函数绑定</p>
<p>通过 new 操作符调用普通函数时，会创建一个新的对象，并将 this 绑定到这个新对象。</p>
<code>
    <pre>function Person(name) {
  this.name = name;
}
const alice = new Person("Alice");
console.log(alice.name); // 输出: Alice</pre>
</code>
<p>5. 箭头函数中的嵌套调用</p>
<p>在普通函数中，嵌套函数的 this 不会自动继承外层函数的 this，需要手动绑定或者使用 var self = this 保存外部 this。</p>
<code>
    <pre>const obj = {
  name: "Alice",
  outer: function () {
    console.log(this.name); // Alice
    function inner() {
      console.log(this.name); // undefined 或抛出错误 (this 指向全局)
    }
    inner();
  },
};
obj.outer();</pre>
</code>
<h4>二、箭头函数的 this 指向</h4>
<p>箭头函数的 this 是静态绑定的，它不会根据调用方式改变，而是始终继承自定义它时所在的词法作用域中的 this。</p>
<p>1. 词法作用域绑定</p>
<p>箭头函数的 this 是在定义时确定的，而非调用时。</p>
<code>
    <pre>const obj = {
  name: "Alice",
  sayName: () => {
    console.log(this.name);
  },
};

obj.sayName(); // undefined (this 指向外层作用域的 this，即全局对象)</pre>
</code>
<p>2. 箭头函数与普通函数的对比</p>
<code>
    <pre>const obj = {
  name: "Alice",
  sayNameNormal: function () {
    console.log(this.name);
  },
  sayNameArrow: () => {
    console.log(this.name);
  },
};

obj.sayNameNormal(); // Alice (this 指向 obj)
obj.sayNameArrow(); // undefined (this 指向外层作用域的 this)</pre>
</code>
<p>3. 箭头函数在回调中的使用</p>
<p>箭头函数特别适用于嵌套函数或回调函数中，因为它继承了外层作用域的 this，避免了动态绑定问题。</p>
<p>示例：普通函数中的嵌套调用问题</p>
<code>
    <pre>function Timer() {
  this.seconds = 0;
  setInterval(function () {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}

const timer = new Timer();
// 输出: NaN 或抛出错误，因为 this 指向全局对象</pre>
</code>
<p>示例：箭头函数解决问题</p>
<code>
    <pre>function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}

const timer = new Timer();
// 输出: 每秒递增的数字，this 绑定到 Timer 实例</pre>
</code>
<p>4. 箭头函数不适合用作构造函数</p>
<p>箭头函数没有 prototype，因此不能用作构造函数。</p>
<code>
    <pre>const Arrow = () => {};
const obj = new Arrow(); // 抛出错误：Arrow is not a constructor</pre>
</code>







<h4>call和apply作用一样，区别就是参数区别；apply参数为数据</h4>
<code>
    <pre>getDate.call({year:2022},1,1) // 2022-1-1</pre>
</code>
<code>
    <pre>getDate.apply({year:2023},[1,1]) // 2023-1-1</pre>
</code>
<h4>bind是返回函数 不会立即调用</h4>
<code>
    <pre>let newFun = getDate.bind({year:2024})(1,1)</pre>
    <pre>newFun() // 2024-1-1</pre>
</code>

</template>
<script setup>
</script>
<style lang='scss' scoped>
p{
    text-align: left;
}
</style>