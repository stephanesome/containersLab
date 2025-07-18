import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookEntity} from '../model/bookEntity';
import {BooksService} from '../service/books-service';
import {Subscription} from "rxjs";
import { AuthornamesPipe } from '../../pipes/authornames.pipe';


@Component({
  selector: 'app-book',
  templateUrl: './book.html',
  styleUrls: ['./book.css'],
  imports: [AuthornamesPipe]
})
export class Book implements OnInit, OnDestroy {
  selectedBook!: BookEntity | null;
  private subscription!: Subscription;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private booksService: BooksService = inject(BooksService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.subscription = this.booksService.getBook(id).subscribe({
        next: (data: BookEntity) => {
          this.selectedBook = data;
        },
        error: (_: any) => {
          this.selectedBook = null;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
