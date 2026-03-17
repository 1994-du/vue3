<template>
    <h4>Class</h4>
    <h5>静态属性</h5>
    <code>
        <pre>使用类名访问</pre>
        <pre>所有实例共享此属性</pre>
    </code>
    <h5>私有属性</h5>
    <code>
        <pre>在类内部访问</pre>
        <pre>每个实例独有此属性</pre>
    </code>
    <CodeEditor code="class BankAccount {
  #balance = 1000; // 私有属性

  getBalance() {
      return this.#balance; // ✅ 类内部可以访问
  }
}

const account = new BankAccount();
console.log(account.getBalance()); // ✅ 1000
console.log(BankAccount.#balance); // ❌ 报错 (SyntaxError: Private field '#balance' must be declared in an enclosing class)"
/>
</template>

<script setup>

</script>
<style scoped lang='less'>
</style>