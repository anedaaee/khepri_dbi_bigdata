// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

import { Account} from 'mdi-material-ui'

import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useEffect,useState } from 'react'


  import api from 'src/@core/utils/api'

const Dashboard = () => {
  const [data,setData] = useState({})
  const [loading,setLoading] = useState(true)

  const fetchData = async() => {
    try{
      const result = await api('get',`/Account/GetDashboardInfo?token=${localStorage.getItem('authToken-oilyfan')}`,{})
      if(result){
        setData(result.data.data)
      }
    }catch(err){

    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    try{
      fetchData()
    }catch(err){

    }
  } ,[])

  return (
    <div>
      {
        loading?
        (
          <div style={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <img src='/loading.gif' alt='loading' style={{width:'20%'}}/> 
            <p style={{color:'#ff5358'}}>Loading...</p>
          </div>
        ):
        (
          <ApexChartWrapper>
            <Grid container spacing={6}>
              <Grid item xs={12} md={16}>
                <Grid item xs={12}>
                  <Typography variant='h5'>   
                      <Link>
                        System Overview
                    </Link>
                  </Typography>
                  <br/>
                </Grid>
                <StatisticsCard data={data}/>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TotalEarning data={data}/>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <CardStatisticsVerticalComponent
                      stats={data.nOfOrders}
                      icon={<Poll />}
                      color='success'
                      title='Number Of Orders'
                      subtitle='All Record'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CardStatisticsVerticalComponent
                      stats={data.nOfUsers}
                      title='Number Of User'
                      color='secondary'
                      subtitle='All Record'
                      icon={<Account />}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Typography variant='h5'>
                    <Link>
                      Active Session
                    </Link>
                  </Typography>
                  <br/>
                </Grid>
                <Table data={data.sessionData}/>
              </Grid>
            </Grid>
          </ApexChartWrapper>
        )  
      }
    </div>
    
  )
}

export default Dashboard
