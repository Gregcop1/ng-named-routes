# ng-named-routes
Service to set and get named routes for angular 4+ router

One day Angular team had the idea to remove the name parameter of their routes. They had certainly good reason, ... I'm pretty sure they had... but in some case those reasons don't apply.
This service is the easiest way to reuse them. It allow you to name some route and use those name in component or template instead of the full path you usually copy/paste everywhere in your app (what a joy when the client ask your to change paths ;))

## Installation

for npm user:
```
npm install ng-named-routes
```

for yarn user:
```
yarn add ng-named-routes
```

## Configuration

Give some name to your routes by adding an extra property `name` in their declaration:
```
export const appRoutes: Array<any> = [
  { path: 'login', component: LoginComponent, name: 'login' },
  {
    path: '',
    children: [
      { path: 'users', name: 'users.list', children: [
        { path: 'create', component: UserCreateComponent, name: 'user.create', canActivate: [AuthGuard] },
        { path: '', component: UserListComponent, canActivate: [AuthGuard] },
      ]},
      { path: '', component: SidebarComponent, outlet: 'aside', canActivate: [AuthGuard] },
    ],
  },
];
```
As you can see, you can apply name on each level of routes.

> Note: this `name` property is not compatible with `Routes` type, that's why I declared my var with a `Array<any>` type, but it's not a problem cause this array is style compatible with route's declaration (`RouterModule.forRoot(appRoutes)`).

Ok, our routes have names so ng-named-routes can enter in action if you declare it in your app module.

```
// app.module.ts

@NgModule({
  declarations: [ ... ],
  imports: [ ...
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    NamedRoutesService,
  ],
  ...
})
export class AppModule { }
```

Now our service is ready to serve but still needs one more step. Feed him with your routes:

```
// app.module.ts
@NgModule({
  declarations: [ ... ],
  imports: [ ... ],
  providers: [
    NamedRoutesService,
  ],
  ...
})
export class AppModule {
  constructor(router: Router, namedRoutesService: NamedRoutesService) {
    namedRoutesService.setRoutes(router.config);
  }
}
```

That's it for config part, now let's see how to use it in our app.

## Usage

### In a controller

If you want to use a route named in your component, declare the service with dependency injection and get the route full path by calling the `getRoute` function with a name you declared earlier as parameter.

```
@Component({...})
export class DashboardComponent {
  constructor(private namedRoutesService: NamedRoutesService, private router: Router) { }

  public goToList() {
    this.router.navigate([this.namedRoutesService.getRoute('test-instances.list')]);
  }
}
```

> Note: Does it work with nested routes? Of course! when you fed the service, the class has build a mapping of named and full paths auto-magically found.

### In template

If you want to use a route in a template you can expose the `getRoute` function of the service to your template.

```
@Component({...})
export class DashboardComponent {
  public getRoute: (...any) => string;

  constructor(private namedRoutesService: NamedRoutesService) {
    this.getRoute = this.namedRoutesService.getRoute.bind(this.namedRoutesService);
  }
}
```

And then in the template:

```
<a [routerLink]="getRoute('user.list')">User list</a>
```

> Note: don't forget to rewrite context of the `getRoute` function by using `bind` otherwise you'll encounter some problem to find your routes.


## Q/A

<details>
    <summary>Can I use it with nested routes?</summary>
    Of course, you can. When service register name, it calculate the full path of routes and bind it to the name.
</details>
<details>
    <summary>Can I use it with routes which have parameters?</summary>
    Of course, you can. This service is only concern with path, so if you have parameters or custom config, it doesn't not concern this service.
</details>

## I've found a bug

I will not agitate my hand before your eyes, saying that's not the feature you are looking for. Ok! Shits happen.

Feel free to [create an issue][issues] and if you have some time maybe you can propose a Pull Request. :)

[issues]:https://github.com/Gregcop1/ng-named-routes/issues
