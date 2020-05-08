import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Page404ComponentPage } from './page404-component.page';

describe('Page404ComponentPage', () => {
  let component: Page404ComponentPage;
  let fixture: ComponentFixture<Page404ComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Page404ComponentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Page404ComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
