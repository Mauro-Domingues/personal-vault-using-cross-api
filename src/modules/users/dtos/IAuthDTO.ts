export interface IAuthDTO {
  email: string;
  password: string;
  refresh_token?: string | Array<string>;
  ip: string;
}
