import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PcontentPage } from './pcontent.page';

describe('PcontentPage', () => {
  let component: PcontentPage;
  let fixture: ComponentFixture<PcontentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcontentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PcontentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
