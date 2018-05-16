<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { UserApi, NoticeApi } from '../api'
import util from '@/libs/util.js';

export default {
    data () {
        return {
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    UserApi.login(this.form)
                        .then(({ data }) => {
                            if (data.code === this.$code.SUCCESS)
                                return this.handleSuccess(data.data)
                            return this.$Message.error(data.msg)
                        })
                }
            })
        },

        handleSuccess (data) {
            Cookies.set('user', this.form.username);
            Cookies.set('password', this.form.password);
            Cookies.set('token', data.user.token);
            Cookies.set('role', data.user.role);
            this.getNotice();
            this.$store.dispatch('login', data)

            this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');

            if (this.form.username === 'iview_admin') {

                Cookies.set('access', 0);
            } else {
                Cookies.set('access', 1);
            }
            this.$store.commit('clearAllTags');
            this.$router.push({
                name: 'home_index'
            });
        },
        getNotice(){
                NoticeApi.count().then(({data}) => {
                    if (data.code === this.$code.SUCCESS){
                        Cookies.set('messageCount', util.safe(data, 'data.result.unread', 0));
                } else {
                    return this.$Message.error(data.msg);
                }});
            },
    }
};
</script>

<style>

</style>
