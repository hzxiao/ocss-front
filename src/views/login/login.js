import user from '@/api/user.api'
import store from '@/store/index'

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
        }
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    user.login(this.form)
                    .then(res => {
                        let body = res.data
                        if (body.code == this.$code.SUCCESS) {
                            this.handleLoginSuccess(body)
                        } else {
                            this.$Message.error(body.msg)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        this.$Message.error('Fail!')
                    })
                }
            })
        },
        handleLoginSuccess: function (res) {
            this.$store.dispatch('initUser', res.data.user).then(() => {
                this.$Message.success('登录成功')
                this.$router.push({
                    path: '/'
                })
            })
        }
    }
}
