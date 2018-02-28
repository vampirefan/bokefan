<template>
  <el-row class="container">
    <aside class="sidebar">
      <el-menu mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :default-active="menuActive" @select="doMenuSelect">
        <el-menu-item index="#"><i class="el-icon-date"></i>设备履历</el-menu-item>
        <el-menu-item index="meters"><i class="el-icon-view"></i>仪器仪表</el-menu-item>
        <el-menu-item index="boards"><i class="el-icon-mobile-phone"></i>备品备件</el-menu-item>
        <el-menu-item index="archives"><i class="el-icon-document"></i>文档资料</el-menu-item>
      </el-menu>
    </aside>
    <section class="content">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </section>
  </el-row>
</template>
<script>

export default {
  name: 'main-page',
  components: {
  },
  computed: {
  },
  data () {
    return {
      menuActive: '#'
    }
  },
  methods: {
    doMenuSelect (index) {
      this.$router.push('/' + index)
    }
  },
  mounted () {}
}
</script>
<style scoped>
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.sidebar {
  width: 180px;
  position: fixed;
  background-color: #545c64;
  height: 100%;
}

.content {
  /*position: fixed;*/
  padding-left: 180px;
  /*margin-left: 180px;*/
}
</style>
