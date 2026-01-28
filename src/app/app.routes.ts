import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
      {
            path: '',
            loadComponent: () => import('./components/core/log-in/log-in.component').then(m => m.LogInComponent)
      },
      {
            path: 'forgot-password',
            loadComponent: () => import('./components/core/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
            path: 'verify-otp',
            loadComponent: () => import('./components/core/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
      },
      {
            path: 'reset-password',
            loadComponent: () => import('./components/core/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
            path: 'home',
            loadComponent: () => import('./components/main/main.component').then(m => m.MainComponent),
            children: [
                  {
                        path: 'dashboard',
                        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
                  },
                  {
                        path: 'users',
                        loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent)
                  },
                  {
                        path: 'property-list',
                        loadComponent: () => import('./components/property-list/property-list.component').then(m => m.PropertyListComponent)
                  },
                  {
                        path: 'add-property',
                        loadComponent: () => import('./components/property-list/add-property/add-property.component').then(m => m.AddPropertyComponent)
                  },
                  {
                        path: 'view-property',
                        loadComponent: () => import('./components/property-list/view-property/view-property.component').then(m => m.ViewPropertyComponent)
                  },

                  {
                        path: 'enquiries-list',
                        loadComponent: () => import('./components/enquiries/enquiries.component').then(m => m.EnquiriesComponent)
                  },
                  {
                        path: 'view-enquiries',
                        loadComponent: () => import('./components/enquiries/view-enquiries/view-enquiries.component').then(m => m.ViewEnquiriesComponent)
                  },

                  {
                        path: 'lifestyle-list',
                        loadComponent: () => import('./components/lifestyle-list/lifestyle-list.component').then(m => m.LifestyleListComponent)
                  },
                  {
                        path: 'add-lifestyle',
                        loadComponent: () => import('./components/lifestyle-list/add-lifestyle/add-lifestyle.component').then(m => m.AddLifestyleComponent)
                  },
                  {
                        path: 'view-lifestyle',
                        loadComponent: () => import('./components/lifestyle-list/view-lifestyle/view-lifestyle.component').then(m => m.ViewLifestyleComponent)
                  },
                  {
                        path: 'lifestyle-setting',
                        loadComponent: () => import('./components/lifestyle-list/lifestyle-setting/lifestyle-setting.component').then(m => m.LifestyleSettingComponent)
                  },
                  {
                        path: 'manage-tags',
                        loadComponent: () => import('./components/lifestyle-list/manage-tags/manage-tags.component').then(m => m.ManageTagsComponent)
                  },

                  {
                        path: 'contact-message',
                        loadComponent: () => import('./components/contact-messages/contact-messages.component').then(m => m.ContactMessagesComponent)
                  },
                  {
                        path: 'notifications',
                        loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent)
                  },

                  {
                        path: 'amenities',
                        loadComponent: () => import('./components/amenities/amenities.component').then(m => m.AmenitiesComponent)
                  },
                  {
                        path: 'property-type',
                        loadComponent: () => import('./components/property-type/property-type.component').then(m => m.PropertyTypeComponent)
                  },
                  {
                        path: 'insta-images',
                        loadComponent: () => import('./components/lifestyle-list/insta-images/insta-images.component').then(m => m.InstaImagesComponent)
                  },

                  {
                        path: 'my-profile',
                        loadComponent: () => import('./components/my-profile/my-profile.component').then(m => m.MyProfileComponent)
                  },
                  {
                        path: 'change-password',
                        loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent)
                  },
            ]
      }
];
