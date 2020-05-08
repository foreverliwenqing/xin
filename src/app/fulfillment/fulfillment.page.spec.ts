import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FulfillmentPage } from './fulfillment.page';

describe('FulfillmentPage', () => {
  let component: FulfillmentPage;
  let fixture: ComponentFixture<FulfillmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulfillmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FulfillmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
