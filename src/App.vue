<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body{
  height: 100%;
  margin: 0;
}

#app {
    min-height: 100%;
}
</style>
