import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecelistPage } from './recelist.page';

describe('RecelistPage', () => {
  let component: RecelistPage;
  let fixture: ComponentFixture<RecelistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecelistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecelistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
