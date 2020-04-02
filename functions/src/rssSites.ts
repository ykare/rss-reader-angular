// RSS サイト情報
export interface RssItem {
    name: string,
    feedUrl: string
};

// TODO: 本当は Firestore の登録されている情報を元に RSS サイト一覧を取得しないといけない
const RSS_SITES: RssItem[] = [
    {
        name: 'Hatena',
        feedUrl: `https://b.hatena.ne.jp/hotentry/it.rss`
    },
    {
        name: 'ait',
        feedUrl: 'https://rss.itmedia.co.jp/rss/2.0/ait.xml'
    },
    {
        name: 'qiita',
        feedUrl: 'https://qiita.com/popular-items/feed'
    },
];

export {
    RSS_SITES,
}
