<style>
  @import "../styles/dark.theme.css";
/* 
html body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background: #eee;
} */
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        /* background: #5b6270; */
        border-radius: 3px;
        float: left;
        position: relative;
        top: 10px;
        left: 20px;
    }
    .layout-logo a {
        font-size: 20px;
        font-weight: 900;
        color: #f5f7f9;
    }
    .layout-header{
        height: 50px;
        background: #193aa8;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-ceiling{
        /* background: #464c5b; */
        padding: 10px 0;
        overflow: hidden;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
        margin-top: 5px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;        
        font-size: 14px;
    }
    .layout-trigger {
        float: left;
        margin-top: 10px;
        margin-left: 10px;
    }
    .body.row {
        top: 75px;
        bottom: 0;
        /* width: 200px; */
    }
    .scroll-y {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;  
    }
    .row, .col, .page {
        overflow: hidden;
        position: fixed;
    }

    .col {
        top: 0;
        bottom: 0;
    }
    .left.col {
        width: 200px;
        padding: 0;
        /* margin-top: 50px; */
    }
    .right.col {
        top: 50px;
        left: 200px;
        right: 0;
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
                    <a href="#">注销</a>
                </div>
            </div>
        </div>

        <div class="left col" :style="{width: hideSidebarText?'60px':'200px'}">
            
            <div class="body row scroll-y" style="top:50px" :style="{width: hideSidebarText?'60px':'200px'}">
                <sidebar :hide-sidebar-text="hideSidebarText" theme="dark"></sidebar>
            </div>
        </div>
        
        <div  class="right col body" :style="{left: hideSidebarText?'60px':'200px'}">
            <div class="body row scroll-y" style="padding: 1em">
                <router-view></router-view>
            </div>
            <!--<div class="footer row">-->
            <!--Some status text here-->
            <!--</div>-->
        </div>
    </div>
</template>
<script>

import sidebar from '../components/layout/sidebar.vue'
export default {
    components: {
        sidebar,
    },
    data () {
      return {
        hideSidebarText: false,
      
      }
    },
}
</script>
