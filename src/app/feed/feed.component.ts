import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FeedService } from 'app/services/feed.service';
import { Feed } from 'app/models/feed';
import { Article } from 'app/models/article';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  feed: Feed;
  articles: Observable<Article[]>;

  constructor(
    private route: ActivatedRoute,
    private feedService: FeedService
  ) { }

  ngOnInit() {
    // リクエストパラメータ id で Feed を取得するように設定
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.feedService.getFeed(params.get('id'))
      }

      )
    ).subscribe(feed => {
      this.feed = feed;
      this.feedService.setCurrentFeedId(feed.id);
      this.feedService.setCurrentTitle(feed.title);
      this.articles = this.feedService.getArticles(feed.id);
    });
  }
}