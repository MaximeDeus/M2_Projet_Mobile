import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodolistPage } from './todolist.page';

describe('TodolistPage', () => {
  let component: TodolistPage;
  let fixture: ComponentFixture<TodolistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodolistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodolistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
