<template>
	<div class="shrinkable-menu">
		<slot name="top"></slot>
		<sidebar-menu></sidebar-menu>
	</div>
</template>

<script>
	import sidebarMenu from './sidebar'

	export default {
		name: 'shrinkableMenu',
		components: { sidebarMenu }
	}

</script>

<style lang="less" src="./shrinkable-menu.less"></style>
