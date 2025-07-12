<template>
  <div class="myHome">
    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
// import { ElMessageBox } from 'element-plus'

import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // console.log('00000000')
  router.push("/home");
});
</script>



<style scoped>
.myHome {
  height: 100%;
  width: 100%;

}

</style>
