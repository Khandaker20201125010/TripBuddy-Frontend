
export type UserRole = "ADMIN" | "USER" 
export type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

export const authRoutes = [
    "login",
    "register",
]
export const commonProtectedRoutes : RouteConfig =
   { exact :["/my-profile"],
    patterns : []

}
export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/,/^\/adminDashboard/,/^\/adminProfile/,/^\/manage-users/,/^\/manage-travel-plans/], 
    exact: [], 
}
export const userProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/,/^\/my-travel-plans/,/^\/manage-requests/,/^\/community/], 
    exact: [], 
}

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => pathname === `/${route}`);
};

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
   
}

export const getRouteOwner = (pathname: string): "ADMIN" | "USER" | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    if (isRouteMatches(pathname, userProtectedRoutes)) {
        return "USER";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }
    return null;
}
export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "ADMIN") {
        return "/adminDashboard/adminProfile";
    }
    if (role === "USER") {
        return "/";
    }
   
    return "/";
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }

    return false;
}