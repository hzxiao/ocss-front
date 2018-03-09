<template>
	<Menu ref="sideMenu"
		  :active-name="currentPageName"
		  :open-names="openedMenuList"
		  width="auto"
		  @on-select="changeMenu"
		  :theme="theme">
		<template v-for="item in sidebarMenuList">
			<MenuItem v-if="!item.children" :name="item.name" :key="item.name">
				<Icon :type="item.icon" :size="iconSize" :key="item.path"></Icon>
				<span class="sidebar-menu-text" :key="item.name">{{ item.title }}</span>
			</MenuItem>

			<Submenu :name="item.name" v-if="item.children && item.children.length > 0" :key="item.path">
				<template slot="title">
					<Icon :type="item.icon" :size="iconSize"></Icon>
					<span class="sidebar-menu-text">{{ item.title }}</span>
				</template>
				<MenuItem :name="child.name" :key="child.name" v-for="child in item.children">
					<Icon :type="child.icon" :size="iconSize" :key="child.name"></Icon>
					<span class="sidebar-menu-text" :key="child.name">{{ child.title }}</span>
				</MenuItem>
			</Submenu>
		</template>
	</Menu>
</template>
<style>
	.img-circle {
		border-radius: 50%;
		margin-top: 10px;
	}

	.centered {
		text-align: center;
	}

	h5 {
		color: #292626;
		font-weight: 700;
		font-size: 14px;
		margin-top: 10px;
		margin-bottom: 10px;
		line-height: 1.1;
		font-family: inherit;
	}

</style>
<script>
	import {mapGetters} from 'vuex'
	// import { adminRouter } from '../../router'

	export default {
		name: 'sidebar',
		props: {
			theme: {type: String, default: 'light'}
		},
		data() {
			return {
				currentPageName: null,
				openedMenuList: []
			}
		},
		computed: {
			iconSize() {
				return 14
			},
			...mapGetters([
				'sidebarMenuList'
			])
		},
		watch: {
			'$route'(to) {
				this.currentPageName = to.name
			},
			currentPageName() {
				if (this.$store.state.layout.ready) {
					this.setCurrentPath()
				} else {
					// setTimeout : wait for store state ready when force refresh
					setTimeout(() => {
						this.setCurrentPath()
					}, 100)
				}
			}
		},
		methods: {
			init() {
				this.currentPageName = this.$route.name
			},
			setCurrentPath() {
				this.$store.dispatch('openTab', this.currentPageName)
				this.$store.dispatch('setCurrentPath', this.currentPageName).then(() => {
					this.openedMenuList = this.$store.state.layout.openedMenuNameList.slice()
					this.$nextTick(() => {
						this.$refs.sideMenu.updateOpened()
						this.$refs.sideMenu.updateActiveName()
					})
				})
			},
			changeMenu(menuName) {
				this.currentPageName = menuName
				this.$router.push({
					name: menuName
				})
			}
		},
		mounted() {
			this.init()
		},
		created() {
			// this.sidebarMenuList = this.$store.getters.sidebarMenuList;
		}
	}
</script>
