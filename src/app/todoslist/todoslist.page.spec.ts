import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodoslistPage } from './todoslist.page';

describe('TodoslistPage', () => {
  let component: TodoslistPage;
  let fixture: ComponentFixture<TodoslistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoslistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
