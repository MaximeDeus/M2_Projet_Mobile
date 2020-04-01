import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharedTodolistPage } from './shared-todolist.page';

describe('SharedTodolistPage', () => {
  let component: SharedTodolistPage;
  let fixture: ComponentFixture<SharedTodolistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTodolistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedTodolistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
