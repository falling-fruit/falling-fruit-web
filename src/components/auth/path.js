export const isAccountPath = (path) =>
  ['edit', 'sign_in', 'sign_up', 'password', 'confirmation'].some((tabPath) =>
    path.startsWith(`/users/${tabPath}`),
  )
