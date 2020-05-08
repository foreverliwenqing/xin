import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//引入路由守卫
import { BaseGuard } from './services/base.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register1',
    loadChildren: () => import('./register/register1/register1.module').then( m => m.Register1PageModule)
  },
  {
    path: 'register2',
    loadChildren: () => import('./register/register2/register2.module').then( m => m.Register2PageModule)
  },
  {
    path: 'register3',
    loadChildren: () => import('./register/register3/register3.module').then( m => m.Register3PageModule)
  },
  {
    path: 'productlist',
    loadChildren: () => import('./productlist/productlist.module').then( m => m.ProductlistPageModule)
  },
  {
    path: 'pcontent',
    loadChildren: () => import('./pcontent/pcontent.module').then( m => m.PcontentPageModule)
  },
  {
    path: 'userset',
    loadChildren: () => import('./userset/userset.module').then( m => m.UsersetPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'recelist',
    loadChildren: () => import('./receiving/recelist/recelist.module').then( m => m.RecelistPageModule),
    canActivate: [BaseGuard]
  },
  {
    path: 'addrece',
    loadChildren: () => import('./receiving/addrece/addrece.module').then( m => m.AddrecePageModule)
  },
  {
    path: 'fulfillment',
    loadChildren: () => import('./fulfillment/fulfillment.module').then( m => m.FulfillmentPageModule)
  },
  {
    path: 'allorder',
    loadChildren: () => import('./allorder/allorder.module').then( m => m.AllorderPageModule)
  },
  // 匹配所有没有定义的路由
  {
    path: '**',
    // redirectTo: '/tabs/tab1'
    loadChildren: () => import('./page404-component/page404-component.module').then( m => m.Page404ComponentPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
