const userIsAdmin = (user) => !!user?.roles?.includes('admin')

export const selectIsAdmin = (state) => userIsAdmin(state.auth.user)

export const selectIsAuthLoading = (state) => state.auth.isLoading
