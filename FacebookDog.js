const puppeteer = require('puppeteer');

class FacebookDog {
    constructor({url, account, password}) {
        this.url = url;
        this.account = account;
        this.password = password;
        this.browser = null
        this.context = null
        this.page = null
    }

    async open() {
        this.browser = await puppeteer.launch({headless: false});
        this.context = this.browser.defaultBrowserContext();
        this.context.overridePermissions("https://www.facebook.com", ["geolocation", "notifications"]);
        this.page = await this.browser.newPage();
        await this.page.goto(this.url);
        await this.delay(5000);
        await this.page.evaluate(({account, password}) => {
            document.querySelectorAll('.login_form_input_box')[0].value = account
            document.querySelectorAll('.login_form_input_box')[1].value = password
            document.querySelectorAll('.login_form_login_button')[0].click()
        }, {
            account: this.account,
            password: this.password,
        });
        await this.delay(15000);
        return;
    }

    async getPosts(page) {
        const posts = []
        let i = 0;
        for (let p = 0; p < page; p++) {
            if (i !== 0) {
                await this.delay(8000);
            }
            const lan = await this.page.evaluate(() => {
                return document.querySelectorAll('.userContentWrapper').length
            });
            while (i < lan) {
                await this.clickAllSeeMore()
                const post = await this.getOnePost(i);
                posts.push(post)
                i++;
                await this.scrollToBottom()
            }
        }
        return posts;
    }

    async getOnePost(index) {
        const post = await this.page.evaluate((index) => {
            const postDocument = document.querySelectorAll('.userContentWrapper')[index];
            const data = {
                herf: postDocument.querySelector('abbr').parentElement.href,
                utime: parseInt(postDocument.querySelector('abbr').dataset.utime),
                author: {
                    herf: postDocument.querySelectorAll('a')[1].href,
                    name: postDocument.querySelector('.fcg').innerText,
                    icon: postDocument.querySelectorAll('img')[0],
                },
                text: postDocument.querySelector('div[data-testid=post_message]').innerText,
                image: [],
            }
            postDocument.querySelectorAll('.uiScaledImageContainer').forEach(one => {
                data.image.push(one.children[0].src)
            })
            return data;
        }, index);

        return post;
    }

    async clickAllSeeMore() {
        await this.page.evaluate(() => {
            for (let i = 0; i < document.querySelectorAll('.see_more_link_inner').length; i++) {
                try {
                    document.querySelectorAll('.see_more_link_inner')[i].click()
                } catch (error) {}
            }
        });
    }

    async scrollToBottom() {
        await this.page.evaluate(() => {
            window.scroll(0, 99999999)
        });
    }

    delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }
}

module.exports = FacebookDog;