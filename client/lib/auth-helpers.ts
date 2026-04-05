// Mock auth helpers - will be replaced with real Clerk integration
export const mockGetUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const mockSetUser = (user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

export const mockLogout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

export const isPatientRoute = (pathname: string) => {
  return pathname.startsWith('/patient');
};

export const isDoctorRoute = (pathname: string) => {
  return pathname.startsWith('/doctor');
};

export const isProtectedRoute = (pathname: string) => {
  return isPatientRoute(pathname) || isDoctorRoute(pathname);
};
