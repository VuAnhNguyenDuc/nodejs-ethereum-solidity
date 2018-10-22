export const isAuthenticated = user => !!user;

export const isAllowed = (user,rights) =>
    rights.some(right => user.rights.include(right));

export const hasRole = (user,roles) =>
    roles.some(role => user.roles.include(roles));
