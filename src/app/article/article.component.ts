import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { FeedService } from 'app/services/feed.service';
import { Article } from 'app/models/article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: Article;

  constructor(
    private route: ActivatedRoute,
    private feedService: FeedService
  ) { }

  ngOnInit() {
    // リクエストパラメータ id から Article を取得
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.feedService.getArticle(params.get('id'))
      }
      )
    ).subscribe(article => {
      this.article = article;
      this.feedService.setCurrentFeedId(article.feedId);
      this.feedService.setCurrentTitle(article.title);
    });
  }
}