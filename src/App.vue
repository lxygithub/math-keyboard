<template>
  <div id="app">
<!--    <div v-on:click="show = !show">-->
    <div style="display: none">
      <math-render :value.sync="value" :imgshow='!show'></math-render>
      <code @click="a">latex: {{value}}</code>
    </div>
    <math-keyboard
        :show.sync="show"
        v-bind:keypanel='1'
        :value.sync="value"
        :output.sync="output"
    ></math-keyboard>
  </div>
</template>

<script>
export default {
  data(){
    return{
      show:true,
      value:'',
      output:''
    }
  },
  methods:{
    a(){
      this.value = '2^6'
    }
  },
  watch:{
    ctrl(nval,oval){
      console.log('ctrl'+nval)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
