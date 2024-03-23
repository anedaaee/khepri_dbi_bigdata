// ** React Imports
import { useState } from 'react'

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
import Head from 'next/head'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import { OrderBoolAscendingVariant,ListBoxOutline} from 'mdi-material-ui'
import { LoadingButton } from '@mui/lab'


import OrderForm from 'src/views/Order-setting/OrderForm'
import OrderProperty from 'src/views/Order-setting/OrderProperty'

import 'react-datepicker/dist/react-datepicker.css'
import api from 'src/@core/utils/api'

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
  const [buttonLoading,setButtonLoading] = useState(false)
  
  const [order,setOrder] = useState({
    name :'',
    description : '',
    status:-1,
    user_id:'',
    properties:[]
  })

  const handleChange = (event, newValue) => {

    setValue(newValue)
  }

  const onChangeOrder = (val,key) => {

    try{
      setOrder({
        ...order,
        [key]:val
      })
    }catch(err){

    }
  }

  const onChangePropertyOrder = (val,key,id) => {

    try{
      let newProperty = []
      for(const property of order.properties){
        if(property.id === id){
          
          newProperty.push({
            ...property,
            [key]:val
          })
        }else{
          newProperty.push(property)
        }
      }
      setOrder({
        ...order,
        ['properties']:newProperty
      })
      console.log(order);
    }catch(err){
      console.log(err);

    }

  }


  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
      setButtonLoading(true)
      if(order.name && order.user_id){
        for(const property of order.properties){
          if((property.id?true:false) && property.name && property.kind && (property.kind == 'file' ? (property.file) : (property.value))){

          }else{
            setError('Fill All Parameter')

            return
          }
        }
        let uploadProperty = []
        
        for(const property of order.properties){
          if(property.kind === 'file'){
            let filedata = ''
             
            let dataAPI = new FormData();
            dataAPI.append('file',property.file);
            const result = await api('post',`/File/UploadFile?token=${localStorage.getItem('authToken-oilyfan')}`,dataAPI) 
            if(result){
              filedata = result.data
            }
            
            uploadProperty.push({
              id:property.id,
              name:property.name,
              kind : property.kind,
              unit : property.unit?property.unit:'',
              value : filedata.id,
              filename:filedata.name,
              isVisible:property.isVisible
            })
          }else{
            uploadProperty.push({
              id:property.id,
              name:property.name,
              kind : property.kind,
              unit : property.unit?property.unit:'',
              value : property.value,
              filename:'',
              isVisible:property.isVisible
            })
          }
        }
        setOrder({
          ...order,
          ['properties']:uploadProperty
        })
        const result = await api('get',`/Order/AddOrder?token=${localStorage.getItem('authToken-oilyfan')}&user_id=${order.user_id}&name=${order.name}&description=${order.description}&status=${order.status}&properties=${encodeURIComponent(JSON.stringify(order.properties))}`,{})
        if(result.status == 2){
          window.location.href = '/pages/admin/orders'
        }else{
          //error
        }
      }else{
        setError('Fill All Parameter')

      }
      setButtonLoading(false)
    }catch(err){
      console.log(err);

    }

  }
  
  return (
    <Card>
      <Head>
        <title>{`Oilyfan - Add Order`}</title>
        <meta
          name='description'
          content={`Oilyfan - Add Order`}
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
                <OrderBoolAscendingVariant />
                <TabName>Order</TabName>
              </Box>
            }
          />
          <Tab
            value='properties'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListBoxOutline />
                <TabName>Properties</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='order'>
          <OrderForm order={order} onChangeOrder={(e,key)=>onChangeOrder(e,key)} userSelect={true}/>
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='properties'>
          <OrderProperty order={order} onChangePropertyOrder={(e,key,id)=>onChangePropertyOrder(e,key,id)} changeOrder={(order) => setOrder(order)}/>
        </TabPanel>
        <Box sx={{ mt: 11 }}>
          <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
            <LoadingButton variant='contained' sx={{ marginRight: 3.5 }} onClick={(e) => handleSubmit(e)} loading={buttonLoading}>
              Save Changes
            </LoadingButton>
          </div>
        </Box>
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

export default AccountSettings
