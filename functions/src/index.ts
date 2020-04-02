import * as functions from 'firebase-functions';
import * as rss from "./rss";
import * as admin from "firebase-admin";
import { RSS_SITES } from "./rssSites";

admin.initializeApp();

exports.fetchData = functions.pubsub
    .schedule("every 12 hours")
    .onRun(async context => {
        for (const site of RSS_SITES) {
            await rss.fetchColumn(site.name, site.feedUrl);
        }
    });

exports.addFeed = functions.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');

    if (request.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        response.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST');
        response.set('Access-Control-Allow-Headers', 'Content-Type, authorization');
        response.set('Access-Control-Max-Age', '3600');
        response.status(204).send('');
        return;
    }
    if (request.method !== 'POST') {
        response.status(405).send('Method Not Allowed');
        return;
    }
    if (!request.body || !request.body.name) {
        response.status(400).send('Request Body Not Found');
        return;
    }

    await rss.fetchColumn(request.body.name, request.body.feedUrl, true);

    // Angular の HttpClient はデフォルトで JSON 形式のレスポンスを要求する
    response.status(200).send(JSON.stringify({
        status: 'success',
        message: `add: ${request.body.name}`,
    }));
});
