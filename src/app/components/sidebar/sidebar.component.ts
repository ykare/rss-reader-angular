import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent, AddDialogData } from 'app/add-dialog/add-dialog.component';
import { Location } from '@angular/common';

import { FeedService } from '../../services/feed.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  location: Location;

  menuItems: any[];

  currentFeedId: string;

  dialogData: AddDialogData;

  constructor(location: Location, public dialog: MatDialog, private feedService: FeedService, private element: ElementRef, private renderer: Renderer2, ) {
    this.location = location;
  }

  ngOnInit() {
    this.getRoutes();
    this.currentFeedId = this.feedService.getCurrentFeedId();
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  getRoutes(): void {
    this.feedService.getFeeds()
      .subscribe(feeds => {
        const FEED_PATHS = feeds.map(feed => ({
          path: `/feed/${feed.id}`,
          title: feed.title,
          icon: 'folder',
          class: ''
        }));
        this.menuItems = [...ROUTES.filter(menuItem => menuItem), ...FEED_PATHS];
      });
  };

  isActive(path: string): boolean {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    this.currentFeedId = this.feedService.getCurrentFeedId();
    if (titlee.startsWith('/dashboard')) {
      if (path.startsWith('/dashboard')) {
        return true;
      }
    } else if (path.startsWith('/feed/')) {
      let feedId = path.substring('/feed/'.length);
      if (feedId === this.currentFeedId) {
        return true;
      }
    }
    return false;
  }

  // 購読の追加処理
  openDialog(): void {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '800px',
      position: { top: "2.5rem" },
      data: { dialogData: this.dialogData }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogData = { feedTitle: result.feedTitle, feedUrl: result.feedUrl };

        // API を呼び出して購読追加
        this.feedService
          .addFeed(result.feedTitle, result.feedUrl)
          .subscribe(
            // API 呼び出しが成功した場合
            success => {
              console.log(success);
              $.notify({
                icon: "notifications",
                message: `<b>${result.feedTitle}: &lt;${result.feedUrl}&gt;</b> を購読対象に追加しました`

              }, {
                type: 'success',
                timer: 3000,
                placement: {
                  from: 'top',
                  align: 'center'
                },
                width: '100%',
                template: '<div data-notify="container" class="col-xl-6 col-lg-6 col-11 col-sm-6 col-md-6 alert alert-{0} alert-with-icon" role="alert">' +
                  '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                  '<i class="material-icons" data-notify="icon">notifications</i> ' +
                  '<span data-notify="title">{1}</span> ' +
                  '<span data-notify="message">{2}</span>' +
                  '<div class="progress" data-notify="progressbar">' +
                  '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                  '</div>' +
                  '<a href="{3}" target="{4}" data-notify="url"></a>' +
                  '</div>'
              });
            },
            error => {
              // API 呼び出しが失敗した場合
              console.error(error);
              $.notify({
                icon: "danger",
                message: `購読追加に失敗しました`

              }, {
                type: 'danger',
                timer: 3000,
                placement: {
                  from: 'top',
                  align: 'center'
                },
                width: '100%',
                template: '<div data-notify="container" class="col-xl-6 col-lg-6 col-11 col-sm-6 col-md-6 alert alert-{0} alert-with-icon" role="alert">' +
                  '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                  '<i class="material-icons" data-notify="icon">danger</i> ' +
                  '<span data-notify="title">{1}</span> ' +
                  '<span data-notify="message">{2}</span>' +
                  '<div class="progress" data-notify="progressbar">' +
                  '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                  '</div>' +
                  '<a href="{3}" target="{4}" data-notify="url"></a>' +
                  '</div>'
              });
            }
          );

        this.dialogData = undefined;
      }
    });
  }
}
