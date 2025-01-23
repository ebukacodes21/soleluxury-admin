const routes = {
  HOME: "/",

  SIGNIN: "/signin",
};

const COOKIE_NAME = "soleluxury_user";

export { routes, COOKIE_NAME };

export type GraphData = {
  name: string;
  total: number;
}[]