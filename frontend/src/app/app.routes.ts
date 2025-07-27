import { Routes } from '@angular/router';

export const routes: Routes = [
     {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./search-non-profit/search-non-profit').then((m) => m.SearchNonProfit)
        }
    },
    {
        path: 'history',
        loadComponent: () => {
            return import('./history/history').then((m) => m.History)
        }
    }
];
