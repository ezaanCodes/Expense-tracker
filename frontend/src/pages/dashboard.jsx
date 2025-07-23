import React, { useEffect, useState } from 'react'
import api from '../libs/apiCall';
import { toast } from 'sonner';
import Loading from '../components/ui/loading';
import Info from '../components/ui/info';
import Stats from '../components/ui/stats';
import Chart from '../components/ui/chart';
import DoughnutChart from '../components/ui/doughnutChart';
import Accounts from '../components/ui/accounts';
import Transactions from '../components/ui/recentTransactions';
const Dashboard = () => {

  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false)

  const fetchDashboardStats = async () => {
    const URL = `transaction/dashboard`

    try {
      const { data } = await api.get(URL)

      setData(data)
      console.log("Dashboard data", data)
    } catch (error) {
      toast.error(error?.response?.data?.message
        || "Something unexpected happened. Try again later")
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setisLoading(false)
    }
  }

  useEffect(() => {
    setisLoading(true);
    fetchDashboardStats()
  }, [])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-[80vh]:'>
        <Loading />
      </div>
    )
  }
  return (
    <div className='px-0 md:px-5 2xl:px-20'>
      <Info title="Dashboard" subTitle={"Monitor your financial activities"} />

      <Stats
        dt={{
          balance: data?.availableBalance,
          income: data?.totalIncome,
          expense: data?.totalExpense,
        }}

      />
      <div className='flex flex-col-reverse items-center gap-10 w-full md:flex-row '>

        <Chart data={data?.chartData} />

        {data?.totalIncome > 0 && (
          <DoughnutChart
            dt={{
              balance: data?.availableBalance,
              income: data?.totalIncome,
              expense: data?.totalExpense
            }} />
        )}

      </div>

      <div className='flex flex-col-reverse md:flex-row gap-0 2xl:gap-20'>
        <Transactions data={data?.lastTransactions} />
        {data?.lastAccount?.length > 0 && <Accounts data={data?.lastAccount} />}
      </div>
    </div>
  )
}

export default Dashboard