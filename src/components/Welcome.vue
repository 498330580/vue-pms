<template>
  <div>
    <h1>人员管理系统前端后台首页！</h1>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  created () {
    window.sessionStorage.removeItem('breadcrumb')
    window.sessionStorage.removeItem('pmsmenupath')
    this.$emit('breadcrumb')
  }
}
</script>

<style scoped>

</style>
