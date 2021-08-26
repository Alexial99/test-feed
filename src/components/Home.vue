<template>
    <div align="center" class="container">
        <div class="message_container content-text" id="message-list">
            <div class="message_text_container">
                <div :key="item.id" align="left" v-for="(item, index) in items">
                    <p>{{item.date}} / <b class="author_name-color">{{item.authorName}}</b> / {{item.authorUrl}}</p>
                    <p v-html="item.content"></p>
                    <hr class="hr-color" v-if="index+1<items.length"/>
                </div>
                <div class="loading" v-if="loading">
                    <div class="loadingG">
                        <span id="loadingG_1"></span>
                        <span id="loadingG_2"></span>
                        <span id="loadingG_3"></span>
                    </div>
                    <p>Загрузка данных...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Store from '../core/Store'

    export default {
        name: 'Home',
        data() {
            return {
                items: [],
                loading: false,
                nextPosition: 0,
                length: 10,
            }
        },
        mounted() {
            const messageElem = document.querySelector('#message-list');
            messageElem.addEventListener('scroll', e => {
                const scrolledFactor = 1.01;
                if ((messageElem.scrollTop + messageElem.clientHeight) * scrolledFactor >= messageElem.scrollHeight) {
                    if (!this.loading)
                        this.loadMore();
                }
            })
        },
        created() {
            let obj = Store.getData(this.nextPosition, this.length);
            this.adjustContent(obj.data);
            this.nextPosition = obj.nextPosition;
        },
        methods: {
            loadMore: function () {
                this.loading = true;
                setTimeout(this.loadData, 1000);
            },
            loadData() {
                this.loading = false;
                let obj = Store.getData(this.nextPosition, this.length);
                this.adjustContent(obj.data);
                this.nextPosition = obj.nextPosition;
            },
            postTonesSorter: function (contentPostTones) {
                contentPostTones.sort(function (a, b) {
                    if (a.position < b.position) {
                        return -1;
                    }
                    if (a.position > b.position) {
                        return 1;
                    }
                    return 0;
                })
                return contentPostTones;
            },
            adjustContentTones: function (feed) {
                let thisPosition = 0;
                let newContent = '';
                for (let item of feed.contentPostTones) {
                    newContent += `${feed.content.substr(thisPosition, item.position - thisPosition)}`;
                    newContent += `<span style="background: hsl(${60 * (item.tone + 1)},100%,85.7%)">` +
                        `${feed.content.substr(item.position, item.length)}</span>`;
                    thisPosition = item.position + item.length;
                }
                newContent += `${feed.content.substr(thisPosition)}`;
                return newContent;
            },
            adjustContent: function (page) {
                for (let post of page) {
                    let date = new Date(post.date);
                    post.date = date.toLocaleTimeString("ru", {
                        hour: 'numeric',
                        minute: 'numeric'
                    }) + ', ' + date.toLocaleDateString("ru", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    post.contentPostTones = this.postTonesSorter(post.contentPostTones);
                    post.content = this.adjustContentTones(post);
                    this.items.push(post);
                }
            }
        }
    }
</script>

<style scoped>

    .author_name-color {
        color: rgba(100, 65, 11, 1);
    }

    .content-text {
        color: rgba(160, 161, 160, 1);
        font-size: 12px;
        font-family: Calibri, serif;
    }

    .hr-color {
        border: none;
        height: 1px;
        background: rgb(230, 230, 230);
    }

    .container {
        padding-top: 10%;
    }

    .loading {
        width: 100px;
        text-align: center;
    }

    .message_container {
        width: 80%;
        height: 250px;
        overflow: auto;
    }

    .message_text_container {
        width: 80%;
    }

    ::-webkit-scrollbar {
        width: 6px;
        background-color: #d4d4d4;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #9e9e9e;
        border-radius: 2px;
        border: 2px solid #d4d4d4
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #868686;
    }

    .loadingG {
        text-align: center;
        width: 150px;
        height: 25px;
        margin-left: -25px ;
    }

    .loadingG span {
        display: inline-block;
        vertical-align: middle;
        width: 10px;
        height: 10px;
        margin:14px 20px;
        border-radius: 5px;
        animation: loadingG 1.5s infinite alternate;
        -o-animation: loadingG 1.5s infinite alternate;
        -ms-animation: loadingG 1.5s infinite alternate;
        -webkit-animation: loadingG 1.5s infinite alternate;
        -moz-animation: loadingG 1.5s infinite alternate;
    }

    #loadingG_1 {
        animation-delay: 0s;
        -o-animation-delay: 0s;
        -ms-animation-delay: 0s;
        -webkit-animation-delay: 0s;
        -moz-animation-delay: 0s;
    }

    #loadingG_2 {
        animation-delay: 0.45s;
        -o-animation-delay: 0.45s;
        -ms-animation-delay: 0.45s;
        -webkit-animation-delay: 0.45s;
        -moz-animation-delay: 0.45s;
    }

    #loadingG_3 {
        animation-delay: 0.9s;
        -o-animation-delay: 0.9s;
        -ms-animation-delay: 0.9s;
        -webkit-animation-delay: 0.9s;
        -moz-animation-delay: 0.9s;
    }


    @keyframes loadingG {
        0% {
            width: 2px;
            height: 2px;
            background-color: rgb(120, 120, 120);
            transform: translateY(0);
        }

        100% {
            width: 4px;
            height: 4px;
            background-color: rgb(255, 255, 255);
            transform: translateY(-10px);
        }
    }

    @-o-keyframes loadingG {
        0% {
            width: 2px;
            height: 2px;
            background-color: rgb(120, 120, 120);
            -o-transform: translateY(0);
        }

        100% {
            width: 4px;
            height: 4px;
            background-color: rgb(255, 255, 255);
            -o-transform: translateY(-10px);
        }
    }

    @-ms-keyframes loadingG {
        0% {
            width: 2px;
            height: 2px;
            background-color: rgb(120, 120, 120);
            -ms-transform: translateY(0);
        }

        100% {
            width: 4px;
            height: 4px;
            background-color: rgb(205, 205, 205);
            -ms-transform: translateY(-10px);
        }
    }

    @-webkit-keyframes loadingG {
        0% {
            width: 2px;
            height: 2px;
            background-color: rgb(120, 120, 120);
            -webkit-transform: translateY(0);
        }

        100% {
            width: 4px;
            height: 10px;
            background-color: rgb(205, 205, 205);
            -webkit-transform: translateY(-10px);
        }
    }

    @-moz-keyframes loadingG {
        0% {
            width: 2px;
            height: 2px;
            background-color: rgb(120, 120, 120);
            -moz-transform: translateY(0);
        }

        100% {
            width: 10px;
            height: 10px;
            background-color: rgb(205, 205, 205);
            -moz-transform: translateY(-10px);
        }
    }
</style>
