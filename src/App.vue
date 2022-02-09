<template>
  <el-container style="height:100%;">
    <el-header style="position:fixed;width:100%;text-align:left">
      <el-image style="height:50px" src="/logol.png"></el-image>
    </el-header >  
    <Suspense>
			<template v-slot:default>
				<router-view></router-view>
			</template>
			<template v-slot:fallback>
				<el-skeleton :rows="8" animated />
			</template>
		</Suspense>
    
  </el-container>
</template>
<script>

export default {
  
}
</script>
<style>
#app {
  padding: 0;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
