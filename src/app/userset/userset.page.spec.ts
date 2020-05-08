import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsersetPage } from './userset.page';

describe('UsersetPage', () => {
  let component: UsersetPage;
  let fixture: ComponentFixture<UsersetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
