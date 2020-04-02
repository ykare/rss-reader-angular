import admin = require("firebase-admin");
import rssParser = require("rss-parser");
import axios from "axios";
const cheerio = require('cheerio');

const postToFireStoreData = (parsedItem: rssParser.Item): {} => {

    //   let imageUrl = ""
    //   // 正規表現でsrc内のurlを取得
    //   if (parsedItem.content) {
    //     const res = parsedItem.content.match("<img.*src\s*=\s*[\"|\'](.*?)[\"|\'].*>")
    //     imageUrl = res ? res[1] : ""
    //   }

    return {
        title: parsedItem.title || "",
        url: parsedItem.link || "",
        date: parsedItem.isoDate ? new Date(parsedItem.isoDate) : "",
        imageUrl: parsedItem.imageUrl || "",
        description: parsedItem.contentSnippet || "",
        category: parsedItem.categories || ""
    };
};

const getOGPData = async (item: rssParser.Item): Promise<any> => {
    const result = await axios.get(String(item.link), {
        headers: {
            // Github で 406 が返ってこないように
            // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        },
    }).then(res => {

        // 取得したHTMLからOGPを取得
        const $ = cheerio.load(res.data)
        let imageUrl;
        $('head meta').each((_: any, el: any) => {
            const property = $(el).attr('property')
            const content = $(el).attr('content')
            if (property === 'og:image') {
                imageUrl = content
            }
        });

        // 記事情報にOGPのURLを追加
        return {
            ...item,
            imageUrl,
        };
    }).catch(err => {
        console.error("エラー OGP 取得: ", err);
        return {
            ...item,
        };
    });

    return result;
}

const fetchColumn = async (rssName: string, urlString: string, isNewFeed: boolean = false) => {
    const items: rssParser.Item[] = [];
    const parser = new rssParser();
    const feed = await parser.parseURL(urlString);

    if (feed && feed.items) {
        feed.items.forEach(item => {
            items.push(item)
        });
    }

    // 初期登録時
    if (isNewFeed) {
        const postData = {
            name: rssName,
            title: feed.title || "",
            feedUrl: urlString,
            description: feed.description || "",
            link: feed.link || "",
            date: new Date(),
        }
        await admin
            .firestore()
            .collection('Rss')
            .doc(`${rssName}`).set(postData);
    }

    for (const item of items) {
        const postData = postToFireStoreData(await getOGPData(item));
        const itemsRef = admin
            .firestore()
            .collection("Rss")
            .doc(`${rssName}`)
            .collection("Items");

        const querySnapShot = await itemsRef
            .orderBy("date", "desc")
            .limit(1)
            .get()
            .catch((error: Error) => {
                console.log("エラー アイテム取得: ", error);
            });

        const latestItem: any | null = querySnapShot ? querySnapShot.docs[0] : null
        const latestUrl = latestItem ? latestItem.data().url : "";

        if (String(latestUrl) !== item.link) {
            await itemsRef
                .add(postData)
                .catch(error => {
                    console.log("エラー Document書き込み: ", error);
                });

        }

        if (!isNewFeed) break; // 初期登録時以外はひとつ追加したら終了
    }
};

export { fetchColumn };