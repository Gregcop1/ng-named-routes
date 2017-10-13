interface INamedRoute {
  name: string;
  path: string;
}

export class NamedRouterService {
  private routes: Array<INamedRoute> = [];
  private source: Array<any>;

  /**
   * @param {Array<*>} routes
   * @returns {Array<*>}
   */
  public setRoutes(routes: Array<any>): Array<any> {
    this.source = [...routes];

    return this.getRoutes(routes);
  }

  /**
   * Converts named routes to simple routes
   *
   * @param {Array<*>} routes
   * @returns {Array<*>}
   */
  private getRoutes(routes: Array<any>): Array<any> {
    return routes.map((route) => {
      const {name, ...props} = route;

      // stores a combination of name and route's full path
      if (name) {
        this.routes.push({ name, path: this.getFulltPath(name, this.source) });
      }

      return {
        ...props,
        children: route.children ? this.getRoutes(route.children) : null,
      };
    });
  }

  /**
   * Recursively get the full path for a specific route
   *
   * @param {string} target
   * @param {Array<*>} routes
   * @returns {string}
   */
  private getFulltPath(target: string, routes: Array<any>): string {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      if (target === route.name) {
        return route.path;
      } else {
        if (route.children) {
          const subPath = this.getFulltPath(target, route.children);

          if (undefined !== subPath) {
            return `${route.path}/${subPath}`;
          }
        }
      }
    }

    return undefined;
  }

  /**
   * @param {string} name
   * @returns {string}
   */
  public getRoute(name: string): string {
    const route = this.routes.find(item => name === item.name);

    if (!route) {
      throw new Error(`Can't find route with name: "${name}"`);
    }

    return route.path;
  }
}

export const namedRoutes: NamedRouterService = new NamedRouterService();
