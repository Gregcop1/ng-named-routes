import {NamedRoutesService} from './named-routes.service';

let namedRouteService: NamedRoutesService;
let routes: any[];

beforeEach(() => {
  namedRouteService = new NamedRoutesService();
  routes = [
    { path: 'login', name: 'login' },
    {
      path: '',
      children: [
        { path: 'users', name: 'users.list', children: [
          { path: 'create', name: 'user.create' },
          { path: 'edit/:id/:slug', name: 'user.edit' },
        ]},
        { path: '', outlet: 'aside' },
      ],
    },
  ];
  namedRouteService.setRoutes(routes);
});

test('it should map names with full paths', () => {
  expect(namedRouteService.routes.length).toEqual(4);
  expect(namedRouteService.routes).toContainEqual({name: 'login', path: 'login'});
  expect(namedRouteService.routes).toContainEqual({name: 'users.list', path: '/users'});
  expect(namedRouteService.routes).toContainEqual({name: 'user.create', path: '/users/create'});
  expect(namedRouteService.routes).toContainEqual({name: 'user.edit', path: '/users/edit/:id/:slug'});
});

test('it should throw an error if a route contain a name but no path', () => {
  const func = () => {
    namedRouteService.setRoutes([
      ...routes,
      { name: 'name with no path' },
    ]);
  };

  expect(func).toThrowError('You should provide a path for the route named "name with no path"');
});

test('it should throw an error if a route contain a name but an empty path', () => {
  const func = () => {
    namedRouteService.setRoutes([
      ...routes,
      { path: '', name: 'name with an empty path' },
    ]);
  };

  expect(func).toThrowError('You should provide a path for the route named "name with an empty path"');
});

test('it should find existing paths', () => {
  expect(namedRouteService.getRoute('login')).toEqual('login');
  expect(namedRouteService.getRoute('user.create')).toEqual('/users/create');
});

test('it should reject wrong paths', () => {
  const func = () => namedRouteService.getRoute('invalid.path');

  expect(func).toThrowError(`Can't find route with name: "invalid.path"`);
});

test('it should find existing paths with params', () => {
  expect(namedRouteService.getRoute('user.edit')).toEqual('/users/edit/:id/:slug');
  expect(namedRouteService.getRoute('user.edit', {id: 1})).toEqual('/users/edit/1/:slug');
  expect(namedRouteService.getRoute('user.edit', {slug: 'chuck', id: 1})).toEqual('/users/edit/1/chuck');
});
