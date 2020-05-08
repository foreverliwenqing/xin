import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddrecePage } from './addrece.page';

describe('AddrecePage', () => {
  let component: AddrecePage;
  let fixture: ComponentFixture<AddrecePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddrecePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddrecePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
