export interface INamedRoute {
  name: string;
  path: string;
}

export interface IRouter {
  config: object[];
  [key: string]: any;
}

export class NamedRoutesService {
  private _routes: INamedRoute[] = [];
  private source: any[];

  public get routes(): INamedRoute[] {
    return this._routes;
  }

  /**
   * @param {Array<any>} routes
   */
  public setRoutes(routes: any[]): void {
    this.source = [...routes];
    this.buildRoutes(routes);
  }

  /**
   * @param {string} name
   * @returns {string}
   */
  public getRoute(name: string): string {
    const route = this._routes.find((item) => name === item.name);

    if (!route) {
      throw new Error(`Can't find route with name: "${name}"`);
    }

    return route.path;
  }

  /**
   * Converts named routes to simple routes
   *
   * @param {Array<any>} routes
   * @returns {Array<any>}
   */
  private buildRoutes(routes: any[]): void {
    routes.map((route) => {
      const {name, ...props} = route;

      // stores a combination of name and route's full path
      if (name) {
        if (undefined === props.path || '' === props.path.trim()) {
          throw new Error(`You should provide a path for the route named "${name}"`);
        }

        this._routes.push({name, path: this.getFullPath(name, this.source)});
      }

      return {
        ...props,
        children: route.children ? this.buildRoutes(route.children) : null,
      };
    });
  }

  /**
   * Recursively get the full path for a specific route
   *
   * @param {string} target
   * @param {Array<any>} routes
   * @returns {string}
   */
  private getFullPath(target: string, routes: any[]): string {
    for (const route of routes) {
      if (target === route.name) {
        return route.path;
      } else {
        if (route.children) {
          const subPath = this.getFullPath(target, route.children);

          if (undefined !== subPath) {
            return `${route.path}/${subPath}`;
          }
        }
      }
    }

    return undefined;
  }
}
