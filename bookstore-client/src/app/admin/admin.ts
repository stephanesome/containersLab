import {Component, inject, OnInit} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AuthorEntity, BookEntity} from '../books/model/bookEntity';
import {BooksService} from '../books/service/books-service';
import { NgStyle } from '@angular/common';

function categoryValidator(control: FormControl<string>): { [s: string]: boolean } | null {
  const validCategories = ['Kids', 'Tech', 'Cook'];
  if (!validCategories.includes(control.value)) {
    return {invalidCategory: true};
  }
  return null;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  imports: [NgStyle, FormsModule, ReactiveFormsModule]
})
export class Admin implements OnInit {
  private builder: FormBuilder = inject(FormBuilder);
  private booksService: BooksService = inject(BooksService);
  message: string = '';
  hideMsg = true;
  msgStyle = {
    color: '',
    'background-color': 'white',
    'font-size': '150%',
  };
  bookForm = this.builder.group({
    category: ['', [Validators.required, categoryValidator]],
    title: ['', Validators.required],
    cost: ['', [Validators.required, Validators.pattern('\\d+(\\.\\d{1,2})?')]],
    authors: this.builder.array([]),
    year: ['', Validators.required],
    description: ['', Validators.required]
  });

  get category(): AbstractControl {
    return <AbstractControl>this.bookForm.get('category');
  }

  get title(): AbstractControl {
    return <AbstractControl>this.bookForm.get('title');
  }

  get cost(): AbstractControl {
    return <AbstractControl>this.bookForm.get('cost');
  }

  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  ngOnInit(): void {
  }

  showMessage(type: string, msg: string): void {
    this.msgStyle.color = type === 'error' ? 'red' : 'blue';
    this.message = msg;
    this.hideMsg = false;
    setTimeout(
      () => {
        this.hideMsg = true;
      }, 3000
    );
  }

  onSubmit(): void {
    if (!this.bookForm.invalid) {
      const book = new BookEntity(0,
        <string>this.bookForm.value.category,
        <string>this.bookForm.value.title,
        Number(this.bookForm.value.cost),
        [],
        Number(this.bookForm.value.year),
        <string>this.bookForm.value.description);
      const authors = <AuthorEntity[]>this.bookForm.value.authors;
      this.booksService.addBook(book).subscribe({
        next: (response) => {
          authors.forEach(
            (author: AuthorEntity) => {
              this.booksService.getAuthorsNamed(author.firstName, author.lastName).subscribe({
                  next: (authorList: AuthorEntity[]) => {
                    if (authorList === undefined || authorList.length === 0) {
                      this.booksService.addBookAuthor(response.id, author).subscribe();
                    } else {
                      // *** Assumes unique firstName/LastName for Authors
                      this.booksService.updateBookAuthors(response.id, authorList[0].id).subscribe();
                    }
                  }
                }
              );
            }
          );
          this.showMessage('info', `The was successfully added with id ${response.id}`);
        },
        error: (_: any) => {
          this.showMessage('error', 'Unable to add the book');
        }
      });
      this.bookForm.reset();
      this.authors.clear();
    }
  }

  addAuthor(): void {
    this.authors.push(
      this.builder.group({
        firstName: [''],
        lastName: ['']
      })
    );
  }

  removeAuthor(i: number): void {
    this.authors.removeAt(i);
  }
}
