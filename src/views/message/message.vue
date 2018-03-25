<style lang="less">
    @import './message.less';
</style>

<template>
    <div class="message-main-con">
        <div class="message-mainlist-con">
            <div>
                <Button @click="setCurrentMesType('unread')" size="large" long type="text">
                    <transition name="mes-current-type-btn">
                        <Icon v-show="currentMessageType === 'unread'" type="checkmark"></Icon>
                    </transition>
                    <span class="mes-type-btn-text">未读消息</span>
                    <Badge class="message-count-badge-outer" class-name="message-count-badge"
                           :count="unreadCount"></Badge>
                </Button>
            </div>
            <div>
                <Button @click="setCurrentMesType('read')" size="large" long type="text">
                    <transition name="mes-current-type-btn">
                        <Icon v-show="currentMessageType === 'read'" type="checkmark"></Icon>
                    </transition>
                    <span class="mes-type-btn-text">已读消息</span>
                    <Badge class="message-count-badge-outer" class-name="message-count-badge"
                           :count="readCount"></Badge>
                </Button>
            </div>
            <div>
                <Button @click="setCurrentMesType('recyclebin')" size="large" long type="text">
                    <transition name="mes-current-type-btn">
                        <Icon v-show="currentMessageType === 'recyclebin'" type="checkmark"></Icon>
                    </transition>
                    <span class="mes-type-btn-text">回收站</span>
                    <Badge class="message-count-badge-outer" class-name="message-count-badge"
                           :count="recyclebinCount"></Badge>
                </Button>
            </div>
        </div>
        <div class="message-content-con">
            <transition name="view-message">
                <div v-if="showMesTitleList" class="message-title-list-con">
                    <Table ref="messageList" :columns="mesTitleColumns" :data="currentMesList"
                           :no-data-text="noDataText"></Table>
                </div>
            </transition>
            <transition name="back-message-list">
                <div v-if="!showMesTitleList" class="message-view-content-con">
                    <div class="message-content-top-bar">
                        <span class="mes-back-btn-con"><Button type="text" @click="backMesTitleList"><Icon
                                type="chevron-left"></Icon>&nbsp;&nbsp;返回</Button></span>
                        <h3 class="mes-title">{{ mes.title }}</h3>
                    </div>
                    <p class="mes-time-con">
                        <Icon type="android-time"></Icon>&nbsp;&nbsp;{{ mes.create }}
                    </p>
                    <div class="message-content-body">
                        <p class="message-content">{{ mes.content }}</p>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import {NoticeApi} from '../../api'
    import util from '../../libs/util';

    export default {
        name: 'message_index',
        data() {
            const markAsreadBtn = (h, params) => {
                return h('Button', {
                    props: {
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            this.update(2, params.index)
                            this.$store.commit('setMessageCount', this.unreadMesList.length);
                        }
                    }
                }, '标为已读');
            };
            const deleteMesBtn = (h, params) => {
                return h('Button', {
                    props: {
                        size: 'small',
                        type: 'error'
                    },
                    on: {
                        click: () => {
                            this.update(3, params.index)
                        }
                    }
                }, '删除');
            };
            const restoreBtn = (h, params) => {
                return h('Button', {
                    props: {
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            this.update(2, params.index)
                        }
                    }
                }, '还原');
            };
            return {
                currentMesList: [],
                unreadMesList: [],
                readMesList: [],
                recyclebinList: [],
                currentMessageType: 'unread',
                showMesTitleList: true,
                unreadCount: 0,
                readCount: 0,
                recyclebinCount: 0,
                noDataText: '暂无未读消息',
                mes: {
                    title: '',
                    create: '',
                    content: ''
                },
                mesTitleColumns: [
                    {
                        title: ' ',
                        key: 'title',
                        align: 'left',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        this.showMesTitleList = false;
                                        this.mes.title = params.row.title;
                                        this.mes.create = this.formatDate(params.row.create);
                                        this.getContent(params.index);
                                    }
                                }
                            }, params.row.title);
                        }
                    },
                    {
                        title: ' ',
                        key: 'create',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'android-time',
                                        size: 12
                                    },
                                    style: {
                                        margin: '0 5px'
                                    }
                                }),
                                h('span', {
                                    props: {
                                        type: 'android-time',
                                        size: 12
                                    }
                                }, this.formatDate(params.row.create))
                            ]);
                        }
                    },
                    {
                        title: ' ',
                        key: 'asread',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if (this.currentMessageType === 'unread') {
                                return h('div', [
                                    markAsreadBtn(h, params)
                                ]);
                            } else if (this.currentMessageType === 'read') {
                                return h('div', [
                                    deleteMesBtn(h, params)
                                ]);
                            } else {
                                return h('div', [
                                    restoreBtn(h, params)
                                ]);
                            }
                        }
                    }
                ]
            };
        },
        methods: {
            formatDate(time) {
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return year + '/' + month + '/' + day + '  ' + hour + ':' + minute + ':' + second;
            },
            backMesTitleList() {
                this.showMesTitleList = true;
            },
            setCurrentMesType(type) {
                if (this.currentMessageType !== type) {
                    this.showMesTitleList = true;
                }
                this.currentMessageType = type;
                this.refreshData();
            },
            getContent(index) {
                this.mes.content = this.currentMesList[index].content;
            },

            refreshData() {
                NoticeApi.count().then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.unreadCount = util.safe(data, 'data.result.unread', 0);
                        this.readCount = util.safe(data, 'data.result.read', 0);
                        this.recyclebinCount = util.safe(data, 'data.result.deleted', 0)
                    } else {
                        return this.$Message.error(data.msg)
                    }
                });
                let status = 0;
                let type = this.currentMessageType;
                if (type === 'unread') {
                    status = 1;
                } else if (type === 'read') {
                    status = 2;
                } else {
                    status = 3;
                }
                NoticeApi.list({status: status}).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        if (type === 'unread') {
                            this.noDataText = '暂无未读消息';
                            this.currentMesList = util.safe(data, 'data.noticeList', []);
                        } else if (type === 'read') {
                            this.noDataText = '暂无已读消息';
                            this.currentMesList = util.safe(data, 'data.noticeList', []);
                        } else {
                            this.noDataText = '回收站无消息';
                            this.currentMesList = util.safe(data, 'data.noticeList', []);
                        }
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            update(status, index) {
                let notice = {
                    id: this.currentMesList[index].id,
                    status: status
                };
                NoticeApi.update(notice).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.refreshData();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            }
        },
        mounted() {
            this.refreshData();
        },
        watch: {
            unreadMesList(arr) {
                this.unreadCount = arr.length;
            },
            readMesList(arr) {
                this.readCount = arr.length;
            },
            recyclebinList(arr) {
                this.recyclebinCount = arr.length;
            }
        }
    };
</script>

