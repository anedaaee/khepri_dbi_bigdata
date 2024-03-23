// ** React Imports
import { useState ,useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import api from 'src/@core/utils/api'
import { LoadingButton } from '@mui/lab'
import TabInfo from 'src/views/account-settings/TabInfo'
import TabAccountEdit from 'src/views/account-settings/TabAccountEdit'
import TabSecurity from 'src/views/account-settings/TabSecurity'

// ** Third Party Styles Imports
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
  const [value, setValue] = useState('account')
  const [user,setUser] = useState({})
  const [userId,setUserId] = useState('')
  const [loading,setLoading] = useState(true)

  const fetchData = async(id) => {
    try{
      const userData = await api('get',
        `/User/GetUser?token=${localStorage.getItem('authToken-oilyfan')}&user_id=${id}`,{})
      setUser(userData.data.user)
      setLoading(false)
    }catch(err){  
      console.log(err);
    }
  }
  useEffect(()=>{
    try{
      const queryString = window.location.search          
      const params = new URLSearchParams(queryString)
      const userId = params.get('id') 
      setUserId(userId)    
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
                      <title>{`Oilyfan - Update User`}</title>
                      <meta
                        name='description'
                        content={`Oilyfan - Update User`}
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
                            value='account'
                            label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountOutline />
                                <TabName>Edit User</TabName>
                            </Box>
                            }
                        />
                        </TabList>

                        <TabPanel sx={{ p: 0 }} value='account'>
                          <TabAccountEdit user={user}/>
                        </TabPanel>
                    </TabContext>
                </Card>
            )
        }
    </div>
    
  )
}

export default AccountSettings
