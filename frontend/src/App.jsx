import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import SignIn from "./pages/auth/sign-in"
import SignUp from "./pages/auth/sign-up"
import Dashboard from "./pages/dashboard"
import Transactions from "./pages/transactions"
import Settings from "./pages/settings"
import Account from "./pages/account-page"

const RootLayout = () => {
  const user = null

  return !user ? <Navigate to="/sign-up" /> : (

    <>
    {/* <Navbar/> */}
      <div>
        <Outlet />
      </div>
    </>

  )
}

function App() {

  return (
    <div>
      <main>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="overview" />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />


          </Route>
          <Route path="/sign-up" element={SignUp} />
          <Route path="/sign-in" element={SignIn} />

        </Routes>

      </main>

    </div>
  )
}

export default App
// _-|