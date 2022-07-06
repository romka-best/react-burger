interface NameParams {
  oldName: string,
  name: string,
  canChange: boolean,
  correctName: boolean
}

interface LoginParams {
  oldLogin: string,
  login: string,
  correctLogin: boolean,
  canChange: boolean
}

interface PasswordParams {
  password: string,
  canChange: boolean,
  correctPassword: boolean,
}

export type {
  NameParams,
  LoginParams,
  PasswordParams,
};