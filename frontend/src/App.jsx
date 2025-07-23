import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import SignIn from "./pages/auth/sign-in"
import SignUp from "./pages/auth/sign-up"
import Dashboard from "./pages/dashboard"
import Transactions from "./pages/transactions"
import Settings from "./pages/settings"
import Account from "./pages/account-page"
import useStore from "./store"
import { setAuthToken } from "./libs/apiCall"
import { Toaster } from "sonner"
import Navbar from "./components/ui/navbar"

const RootLayout = () => {
  const { user } = useStore((state) => state)
  
  setAuthToken(user?.token || "")
  return !user ? (<Navigate to="/sign-up" replace={true} />)
    :
    (
      <>
        <Navbar/>
        <div className="min-h-[calc(h-screen-100px)]">
          <Outlet />
        </div>
      </>
    )
}

function App() {

  return (
    <main>
      <div className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900">

        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="overview" />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accounts" element={<Account />} />

          </Route>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />

        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </main>

  )
}

export default App
// _ | -