import {Router} from '@angular/router';

interface INamedRoute {
    name: string;
    path: string;
}

export interface IRouter {
    config: Array<object>;
    [key: string]: any;
}

export class NamedRoutesService {
    private routes: Array<INamedRoute> = [];
    private source: Array<any>;

    /**
     * @param {Array<any>} routes
     */
    public setRoutes(routes: Array<any>): void {
        this.source = [...routes];
        this.buildRoutes(routes);
    }

    /**
     * Converts named routes to simple routes
     *
     * @param {Array<any>} routes
     * @returns {Array<any>}
     */
    private buildRoutes(routes: Array<any>): void {
        routes.map((route) => {
            const {name, ...props} = route;

            // stores a combination of name and route's full path
            if (name) {
                this.routes.push({ name, path: this.getFulltPath(name, this.source) });
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
