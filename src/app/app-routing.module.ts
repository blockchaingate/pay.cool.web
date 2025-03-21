import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClaimComponent } from './components/claim/claim.component';
import { UserTreeComponent } from './components/user-tree/user-tree.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { PaymentSuccessComponent } from './components/payment/success.component';
import { PaymentFailComponent } from './components/payment/fail.component';
import { MembershipComponent } from './components/membership/membership.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { AboutComponent } from './components/about/about.component';
import { JobComponent } from './components/job/job.component';
import { NewFeaturesComponent } from './components/newFeatures/newFeatures.component';
import { VersionComponent } from './components/version/version.component';
import { TransferOwnershipComponent } from './components/transfer-ownership/transfer-ownership.component';
import { SupportComponent } from './components/support/support.component'
import { RefComponent } from './components/ref/ref.component';
import { IpolistComponent } from './reissue/ipolist/ipolist.component';
import { GetrewardsComponent } from './components/getrewards/getrewards.component';
import { AnnounceComponent } from './components/announce/announce.component';
import { EventComponent } from './components/event/event.component';
import { EventDetailComponent } from './components/event/event-detail/event-detail.component';
import { AnimModule } from './animation/anim.module';
// import { AnimComponent } from './components/animation/anim.component';

const routes: Routes = [
  {
    path: 'animation',
    loadChildren: () => import('./animation/anim.module').then(w => w.AnimModule)
  },
  {
    path: 'reissue',
    loadChildren: () => import('./reissue/reissue.module').then(w => w.ReissueModule)
  },
  {
    path: 'metaforce2',
    loadChildren: () => import('./metaforce/metaforce.module').then(w => w.MetaforceModule)
  },
  {
    path: 'bindpay',
    loadChildren: () => import('./bindpay/bindpay.module').then(w => w.BindpayModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then(w => w.WalletModule)
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(w => w.ProjectModule)
  },
  {
    path: 'me',
    loadChildren: () => import('./me/me.module').then(w => w.MeModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(w => w.AdminModule)
  },
  {
    path: 'solution',
    loadChildren: () => import('./components/solution/solution.module').then(w => w.SolutionModule)
  },
  {
    path: 'admin2',
    loadChildren: () => import('./components/admin/admin.module').then(w => w.AdminModule)
  },
  {
    path: 'merchants',
    loadChildren: () => import('./merchant/merchant.module').then(w => w.MerchantModule)
  },
  {
    path: 'manual',
    loadChildren: () => import('./components/manual/manual.module').then(w => w.ManualModule)
  },
  {
    path: 'my-assets',
    loadChildren: () => import('./components/my-assets/my-asset.module').then(a => a.MyAssetModule)
  },
  {
    path: 'download',
    loadChildren: () => import('./download/download.module').then(a => a.DownloadModule)
  },
  {
    path: 'insight',
    loadChildren: () => import('./insight/insight.module').then(a => a.InsightModule)
  },
  {
    path: 'docs',
    loadChildren: () => import('./docs/docs.module').then(a => a.DocsModule)
  },
  {
    path: 'cashier',
    loadChildren: () => import('./components/cashier/cashier.module').then(m => m.CashierModule)
  },
  // components
  { path: 'getrewards', component: GetrewardsComponent },
  { path: 'version', component: VersionComponent },
  { path: 'ipolist', component: IpolistComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: 'user-tree', component: UserTreeComponent },
  { path: 'transfer-ownership/:id', component: TransferOwnershipComponent },
  { path: 'ref/:refcode', component: RefComponent },
  { path: 'home', component: HomeComponent },
  { path: 'claim/:code', component: ClaimComponent },
  { path: ':lang/privacy', component: PrivacyComponent },
  { path: 'support', component: SupportComponent },
  { path: 'about', component: AboutComponent },
  { path: 'job', component: JobComponent },
  { path: 'newFeatures', component: NewFeaturesComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-fail', component: PaymentFailComponent },
  { path: 'announcement', component: AnnounceComponent },
  { path: 'event', component: EventComponent },
  { path: 'event-detail:id', component: EventDetailComponent },
 // { path: 'animation', component: AnimComponent },

  // otherwise redirect to home
  { path: '', redirectTo: '/home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
