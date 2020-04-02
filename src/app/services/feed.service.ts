import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'firebase/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Feed } from '../models/feed';
import { Article } from '../models/article';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FeedService {
  private feedCollection: AngularFirestoreCollection<Feed>;
  private feedSubject: Subject<Feed>;
  private feeds: Observable<Feed[]>;
  private currentFeedId: string;
  private title: Observable<string>;
  private titleSubject: Subject<string>;

  constructor(private firestore: AngularFirestore, private http: HttpClient) {
    // Firestore から Feed 一覧を非同期に取得するように設定
    this.feedCollection = this.firestore.collection<Feed>('Rss');
    this.feeds = this.feedCollection.snapshotChanges().pipe(
      // ドキュメントの ID を付加するように加工
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Feed;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.feedSubject = new Subject();

    this.titleSubject = new Subject();
    this.title = this.titleSubject.asObservable();

  }

  // 現在のタイトルを非同期に取得
  getCurrentTitle(): Observable<string> {
    return this.title;
  }

  // 現在のタイトルを設定
  setCurrentTitle(title: string) {
    this.titleSubject.next(title);
  }

  // Feed 一覧を非同期に取得
  getFeeds(): Observable<Feed[]> {
    return this.feeds;
  }

  // Firestore から Feed ドキュメントを非同期に取得
  getFeed(id: string): Observable<Feed> {
    return this.firestore.doc<Feed>(`Rss/${id}`).snapshotChanges().pipe(
      // ドキュメントの ID を付加するように加工
      map(action => {
        const data = action.payload.data() as Feed;
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }

  // 現在の Feed ID を設定
  setCurrentFeedId(id: string): void {
    this.currentFeedId = id;
    this.getFeed(id)
      .subscribe(feed => {
        this.feedSubject.next(feed);
      });
  }

  // 現在の Feed ID を取得
  getCurrentFeedId(): string {
    return this.currentFeedId;
  }

  // Cloud Functions を呼び出して新しい購読を追加
  addFeed(feedTitle: string, feedUrl: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const requestBody = {
      name: feedTitle,
      feedUrl: feedUrl,
    };
    return this.http.post<string>(environment.addFeedUrl, requestBody, httpOptions);
  }

  // Article の一覧を Firestore から取得
  getArticles(feedId: string): Observable<Article[]> {
    const articleCollection = this.firestore.collection<Article>(`Rss/${feedId}/Items`);
    return articleCollection.snapshotChanges().pipe(
      // ドキュメントの ID を付加するように加工
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Article;
        const id = a.payload.doc.id;
        return { feedId, id, ...data };
      }))
    );
  }

  // Article の情報を Firestore から取得
  getArticle(id: string): Observable<Article> {
    return this.firestore.doc<Article>(`Rss/${this.currentFeedId}/Items/${id}`).snapshotChanges().pipe(
      // ドキュメントの ID を付加するように加工
      map(action => {
        const data = action.payload.data() as Article;
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
}
