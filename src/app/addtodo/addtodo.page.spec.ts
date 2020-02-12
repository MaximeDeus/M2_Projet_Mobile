import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddtodoPage } from './addtodo.page';

describe('AddtodoPage', () => {
  let component: AddtodoPage;
  let fixture: ComponentFixture<AddtodoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtodoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddtodoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
