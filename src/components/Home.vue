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
                    <p>...</p>
                    Загрузка данных...
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

</style>
