export const getSessionIdFromPathname = (pathname: string) => {
  const parts = pathname.split("/");
  return parts[1] || "0d5tth946j9me9c";
};
