import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllorderPage } from './allorder.page';

describe('AllorderPage', () => {
  let component: AllorderPage;
  let fixture: ComponentFixture<AllorderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllorderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllorderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
