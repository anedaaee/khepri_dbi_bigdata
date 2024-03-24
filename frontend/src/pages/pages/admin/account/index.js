// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import UserTable from 'src/views/tables/UserTable'
import WalletTable from 'src/views/tables/WalletTable'
import { useEffect,useState } from 'react'
import api from 'src/@core/utils/api'
// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import Head from 'next/head'
import { Account, Cellphone, Email, Note } from 'mdi-material-ui'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'

const AccountSettings = () => {

  // ** State
  const [loading,setLoading] = useState(true)
  const [userData,setUserData] = useState([])
  const handleDelete = async(e) => {
    e.preventDefault()
    await api('delete','/users/user',{},true)
    window.localStorage.clear()
    window.location = '/'
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    };
    
  const fetchData = async() => {
    try{
      const userDataAPI = 
        await api('get',
                `/users/user`,{},true)
        
      setUserData(userDataAPI.user)
      console.log(userDataAPI.user)
      setLoading(false)
    }catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    try{
      fetchData()
    }catch(err){

    }
  } , [])
  return (
    <Card>
      {
        loading?
        (
          <div style={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <img src='/loading.gif' alt='loading' style={{width:'20%'}}/> 
            <p style={{color:'#ff5358'}}>Loading...</p>
          </div>
        ):
        (
          <div>
            <Head>
              <title>{`khepri - Users`}</title>
              <meta
                name='description'
                content={`khepri - Account`}
              />
              <meta name='keywords' content='khepri' />
              <meta name='viewport' content='khepri' />
            </Head>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Typography variant='h5' style={{paddingLeft:'20px',paddingTop:'30px'}}>
                    <Link>
                      Information
                    </Link>
                </Typography>
                <br/>
              </Grid>
            </Grid>
            <Grid container spacing={.5}>
              <Grid item xs={6} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Account/>
                  <h3 style={{marginLeft:'10px'}}>Username : <span style={{color:'#939393',fontWeight:'lighter'}}>{userData.username}</span></h3>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Note/>
                  <h3 style={{marginLeft:'10px'}}>Fullname : <span style={{color:'#939393',fontWeight:'lighter'}}>{userData.full_name}</span></h3>
                  </Box>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email/>
                  <h3 style={{marginLeft:'10px'}}>Email : <span style={{color:'#939393',fontWeight:'lighter'}}>{userData.email}</span></h3>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Cellphone/>
                  <h3 style={{marginLeft:'10px'}}>Mobile: <span style={{color:'#939393',fontWeight:'lighter'}}>{userData.phone}</span></h3>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6}>
                <h3>Create Date : <span style={{color:'#939393',fontWeight:'lighter'}}>{formatDate(userData.create_at)}</span></h3>
              </Grid>
              <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                <Button variant='contained' style={{backgroundColor:'transparent',border:'1px solid red',color:'red'}} sx={{ marginRight: 3.5 }} onClick={(e) => handleDelete(e)}>
                    Delete
                </Button>
              </div>
            </Grid>
            <br/><br/><br/><br/><br/><br/>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Typography variant='h5' style={{paddingLeft:'20px',paddingTop:'30px'}}>
                    <Link>
                      Wallet
                    </Link>
                </Typography>
                <br/>
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item xs={12}>
                <Card>
                  <WalletTable wallet={userData.wallet}/>
                </Card>
              </Grid>
            </Grid>
            <br/><br/><br/><br/><br/><br/>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Typography variant='h5' style={{paddingLeft:'20px',paddingTop:'30px'}}>
                    <Link>
                      Purchases
                    </Link>
                </Typography>
                <br/>
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item xs={12}>
                <Card>
                  <UserTable purchase={userData.purchases}/>
                </Card>
              </Grid>
            </Grid>
          </div>
        )
      }

    </Card>
  )
}

export default AccountSettings
