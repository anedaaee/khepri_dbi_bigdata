// ** React Imports
import { useState ,useEffect} from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'


import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import CardHeader from '@mui/material/CardHeader'
import OrderTableCollapsibleShowUserForUserNoStatus from 'src/views/tables/OrderTableCollapsibleShowUserInUserNoStatus'
import api from 'src/@core/utils/api'
import UserLayoutForUser from 'src/layouts/UserLayoutForuser'


import 'react-datepicker/dist/react-datepicker.css'
import Head from 'next/head'



const AccountSettings = () => {
  
  const [orders,setOrders] = useState([])
  const [loading,setLoading] = useState(true)

  const fetchData = async() => {
    try{
        const ordersDataAPI =   
            await api('get',
                    `/Order/GetUserOrder?token=${localStorage.getItem('authToken-oilyfan')}`,{})
        
        if(ordersDataAPI){
            let orderrr = ordersDataAPI.data.orders
            for(const order of orderrr){
                const properties = JSON.parse(decodeURIComponent(order.properties))
                order.properties = properties
            }
           
            const filteredValues = await orderrr
                .filter(obj => obj.status === 1)
            setOrders(filteredValues)
        }
        setLoading(false)
    }catch(err){

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
          <Card>
            <Head>
              <title>{`Oilyfan - In Progress Orders`}</title>
              <meta
                name='description'
                content={`Oilyfan - In Progress Orders`}
              />
              <meta name='keywords' content='Oilyfan' />
              <meta name='viewport' content='Oilyfan' />
            </Head>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Typography variant='h5' style={{paddingLeft:'40px',paddingTop:'30px'}}>
                    <Link>
                      In Progress Orders
                    </Link>
                </Typography>
                <br/>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <OrderTableCollapsibleShowUserForUserNoStatus orders={orders} />
              </Card>
            </Grid>
          </Grid>

          </Card>
        )
      }
    </div>
  )
}

AccountSettings.getLayout = page => <UserLayoutForUser>{page}</UserLayoutForUser>

export default AccountSettings
