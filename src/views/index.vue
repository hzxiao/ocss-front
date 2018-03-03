
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
        background-color: rgb(46, 47, 53);
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
            position: fixed;
            
            .sideMenu {
                // position: absolute;
                // bottom: 0;
                // top: 0;
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
            // left: 200px;
            // position: relative;
            overflow: auto;
            margin-left: 210px;
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
            <span class="layout-trigger">
                <Icon type="navicon" size="30" color="white"></Icon>
            </span>
            <div class="layout-logo">
                <a href="#">OCSS</a>
            </div>

            <div class="layout-ceiling">
                <div class="layout-ceiling-main">
                    <a @click="logout()">注销</a>
                </div>
            </div>
        </div>

        <div class="layout-content">
            <div class="left" :style="{width: hideSidebarText?'60px':'200px'}">
                <div class="sideMenu scroll-y" :style="{width: hideSidebarText?'60px':'200px'}">
                    <sidebar :hide-sidebar-text="hideSidebarText" theme="light"></sidebar>
                </div>
            </div>

            <div  class="right" :style="{left: hideSidebarText?'60px':'200px'}">
                <div class="content scroll-y" style="padding: 1em; width: 100%">
                    <router-view></router-view>
          
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import sidebar from '../components/layout/sidebar.vue'
export default {
    components: {
        sidebar
    },
    data () {
      return {
        hideSidebarText: false
      }
    },
    methods: {
        logout() {
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
