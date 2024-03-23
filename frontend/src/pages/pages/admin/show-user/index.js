// ** React Imports
import { useState , useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import AlertTitle from '@mui/material/AlertTitle'
import Close from 'mdi-material-ui/Close'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'

import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import UserInfo from 'src/views/show-user/UserInfo'
import { OrderBoolAscendingVariant,PlusBoxOutline } from 'mdi-material-ui'
import api from 'src/@core/utils/api'
import UserOrder from 'src/views/show-user/UserOrder'

import 'react-datepicker/dist/react-datepicker.css'
import Head from 'next/head'


const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AccountSettings = () => {
  // ** State
  const [error,setError] = useState('')
  const [value, setValue] = useState('order')
  const [orders,setOrders] = useState([])
  const [user,setUser] = useState([])
  const [loading,setLoading] = useState(true)

  const fetchData = async (id) => {
    try{
      const userAPI = await api('get',`/User/GetUser?token=${localStorage.getItem('authToken-oilyfan')}&user_id=${id}`,{})
      const orderAPI = await api('get',`/Order/GetOrders?token=${localStorage.getItem('authToken-oilyfan')}&userId=${id}`,{})
      
      if(userAPI && orderAPI){
        console.log(userAPI);
        setUser(userAPI.data.user)
        setOrders(orderAPI.data.orders)
        console.log(userAPI.data.user);
      }else{

      }

      setLoading(false)
    }catch(err){}
  }
  
  const handleDelete = async(e) => {
    e.preventDefault()
    try{
      const result = await api('get',`/User/DeleteUser?token=${localStorage.getItem('authToken-oilyfan')}&user_id=${user.id}`,{})
      if(result){
        window.location.href = '/pages/admin/users'
      }
    }catch(err){

    }
  }
  
  const handleEdit = async(e) => {
    e.preventDefault()
    try{
      window.location.href = `/pages/admin/update-user?id=${user.id}`
      
    }catch(err){

    }
  }
  useEffect(() => {
    try{
      const queryString = window.location.search          
      const params = new URLSearchParams(queryString)
      const userId = params.get('id')    
      fetchData(userId)
    }catch(err){

    }
  },[])
  
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }



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
              <title>{`Oilyfan - Show User`}</title>
              <meta
                name='description'
                content={`Oilyfan - Show User`}
              />
              <meta name='keywords' content='Oilyfan' />
              <meta name='viewport' content='Oilyfan' />
            </Head>
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                aria-label='account-settings tabs'
                sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
              >
                <Tab
                  value='order'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountOutline />
                      <TabName>Info</TabName>
                    </Box>
                  }
                />
                {
                  user.adminPrivilage?
                  (
                    <div/>
                  ):
                  (
                    <Tab
                    value='properties'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <OrderBoolAscendingVariant />
                        <TabName>Orders</TabName>
                      </Box>
                    }
                  /> 
                  )
                }
                
              </TabList>

              <TabPanel sx={{ p: 0 }} value='order'>
                <UserInfo user={user} handleDelete={(e) => handleDelete(e)} handleEdit={(e)=>handleEdit(e)}/>
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='properties'>
                <UserOrder orders={orders} user={user}/>
              </TabPanel>
              
              <br/>
              {error ? (
                  <Grid item xs={12} sx={{ mb: 3 }}>
                    <Alert
                      severity='warning'
                      sx={{ '& a': { fontWeight: 400 } }}
                      action={
                        <IconButton size='small' color='inherit' aria-label='close' onClick={() => setError('')}>
                          <Close fontSize='inherit' />
                        </IconButton>
                      }
                    >
                      <AlertTitle>{error}</AlertTitle>
                      <Link href='/' onClick={e => e.preventDefault()}>
                        Check It Again
                      </Link>
                    </Alert>
                  </Grid>
                ) : null}
            </TabContext>
          </Card>
        )
      }
    </div>
  )
}

export default AccountSettings
