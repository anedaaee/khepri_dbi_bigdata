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
      const result = await api('get',`/stock/getStocks`,{},true)
      if(result){
        console.log(result.stock);
        setData(result.stock)
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
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Typography variant='h5'>
                    <Link>
                      Stocks Table
                    </Link>
                  </Typography>
                  <br/>
                </Grid>
                <Table data={data}/>
              </Grid>
            </Grid>
          </ApexChartWrapper>
        )  
      }
    </div>
    
  )
}

export default Dashboard
