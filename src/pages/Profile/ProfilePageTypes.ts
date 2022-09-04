type TName = {
  oldName: string,
  name: string,
  canChange: boolean,
  correctName: boolean
}

type TLogin = {
  oldLogin: string,
  login: string,
  correctLogin: boolean,
  canChange: boolean
}

type TPassword = {
  password: string,
  canChange: boolean,
  correctPassword: boolean,
}

export type {
  TName,
  TLogin,
  TPassword,
};