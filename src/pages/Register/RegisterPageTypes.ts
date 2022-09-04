type TName = {
  name: string,
  correctName: boolean
}

type TEmail = {
  email: string,
  correctEmail: boolean,
}

type TPassword = {
  password: string,
  correctPassword: boolean,
  textError: string
}

export type {
  TName,
  TEmail,
  TPassword,
}
