import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import SignIn from "./pages/auth/sign-in"
import SignUp from "./pages/auth/sign-up"
import Dashboard from "./pages/dashboard"
import Transactions from "./pages/transactions"
import Settings from "./pages/settings"
import Account from "./pages/account-page"
import useStore from "./store"

const RootLayout = () => {
  const { user } = useStore((state) => state)
  console.log(user)

  return !user ? (<Navigate to="/sign-up" replace={true} />)
    :
    (
      <>
        {/* <Navbar/> */}
        <div className="min-h-[calc(h-screen-100px)]">
          <Outlet />
        </div>
      </>
    )
}

function App() {

  return (
    <div className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900">
      <main>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="overview" />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />

          </Route>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />

        </Routes>

      </main>

    </div>
  )
}

export default App
// _ | -