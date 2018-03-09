
<style lang="scss">
	@import "../styles/dark.theme.css";
    .layout {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        // overflow: hidden;
    }
    .layout-header {
        position: fixed;
        left: 0;
        right: 0;
        z-index: 1002;
        display: flex;
        width: 100%;
        height: 50px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background-color: #637a91;
        .layout-trigger {
            margin-left: 20px;
        }
        .layout-logo {
            width: 100px;
            height: 30px;
            border-radius: 3px;
            a {
                font-size: 20px;
                font-weight: 900;
                color: #f5f7f9;
            }
        }
		.layout-breadcrumb {
			* > * {
				color: white;
			}
		}
        .layout-ceiling {
            position: absolute;
            right: 20px;
            a {
                font-size: 14px;
                color: #f5f7f9;
            }
        }
    }
    .layout-content {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        overflow: hidden;
        margin-top: 60px;
        .left {
            // overflow: hidden;
            width: 210px;
            height: 100%;
            .sideMenu {
                overflow: auto;
            }
        }
        .right {
            display: inline-block;
            padding-left: 15px;
            padding-right: 15px;
            padding-bottom: 15px;
            padding-top: 0px;
            width: 100%;
            overflow: auto;
        }
    }
    .scroll-y {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-header">
            <span class="layout-trigger" @click="showMenu = !showMenu">
                <Icon type="navicon" size="30" color="white"></Icon>
            </span>
            <div class="layout-logo">
                <a href="#">OCSS</a>
            </div>

			<div class="layout-breadcrumb">
				<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
			</div>

            <div class="layout-ceiling">
                <div class="layout-ceiling-main">
                    <a @click="logout()">注销</a>
                </div>
            </div>
        </div>

        <div class="layout-content">
            <div class="left" v-if="showMenu">
                <div class="sideMenu scroll-y">
                    <shrinkable-menu>
						<div slot="top">
							<p class="centered"></p>
							<a href="profile.html"><img src="static/img/ui-sam.jpg" class="img-circle" width="60"></a>
							<h5 class="centered">Marcel Newman</h5>
						</div>
					</shrinkable-menu>
                </div>
            </div>

            <div  class="right">
                <div class="content scroll-y">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import shrinkableMenu from '@/components/shrinkable-menu'
import breadcrumbNav from '@/components/breadcrumb-nav'

export default {
    components: {
		breadcrumbNav,
		shrinkableMenu
    },
    data () {
        return {
			showMenu: true
        }
    },
	computed: {
    	currentPath () {
    		return this.$store.state.layout.currentPath
		}
	},
    methods: {
        logout () {
            this.$store.dispatch('logout').then(() => {
                this.$Message.success('注销成功')
                this.$router.push({
                    path: '/login'
                })
            })
        }
    }
}
</script>
