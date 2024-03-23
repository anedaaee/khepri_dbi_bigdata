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
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import AlertTitle from '@mui/material/AlertTitle'
import Close from 'mdi-material-ui/Close'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'

import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'



import OrderShow from 'src/views/Order-setting/OrderShow'
import OrderProperty2 from 'src/views/Order-setting/OrderProperty2'

import 'react-datepicker/dist/react-datepicker.css'
import api from 'src/@core/utils/api'
import OrderForm2 from 'src/views/Order-setting/orderForm2'
import { OrderBoolAscendingVariant,ListBoxOutline } from 'mdi-material-ui'
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
  const [loading,setLoading] = useState(true)
  const [edit,setEdit] = useState(false)
  const [error,setError] = useState('')
  const [value, setValue] = useState('order')
  const [loadingButtonAddProperty,setLoadingButtonAddProperty] = useState(false)
  const [loadingButtonUpdateOrder,setLoadingButtonUpdateOrder] = useState(false)
  const [loadingButtonDeleteOrder,setLoadingButtonDeleteOrder] = useState(false)
  
  const [order,setOrder] = useState({
    name :'',
    description : '',
    status:-1,
    user_id:'',
    properties:[]
  })

  const [orderId,setOrderId] = useState('')

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
    }catch(err){
      console.log(err);
    }
  }
  
  const fetchData = async(id) => {
    try{
      const orderAPI = await api('get',`/Order/GetOrderByID?token=${localStorage.getItem('authToken-oilyfan')}&order_id=${id}`,{})
      
      if(orderAPI){
        let order = orderAPI.data.order
        let properties = JSON.parse(decodeURIComponent(order.properties))  
        order.properties = properties
        setOrder(order)
      }
      setLoading(false)
    }catch(err){

    }
  }
  useEffect(()=>{
    try{
      const queryString = window.location.search          
      const params = new URLSearchParams(queryString)
      const order_id = params.get('id') 
      setOrderId(order_id)
      fetchData(order_id)
      
    }catch(err){

    }
  },[])

  const handleEdit = (e,val) => { 
    
    e.preventDefault()
    try{
      setEdit(val)
    }catch(err){

    }
  }

  const handleOrderDataEdit = (val,key) =>{
    try{
      setOrder({
        ...order,
        [key]:val
      })
    }catch(err){

    }
  }

  const updateOrderData = async(e) => {
    setLoadingButtonUpdateOrder(true)
    e.preventDefault()
    try{
      const orderAPI = await api('get',`/Order/EditOrder?token=${localStorage.getItem('authToken-oilyfan')}&order_id=${order.id}&status=${order.status}&name=${order.name}&description=${order.description}&properties=${encodeURIComponent(JSON.stringify(order.properties))}`,{})
      if(orderAPI){
        window.location.reload()
      }
    }catch(err){

    }
    setLoadingButtonUpdateOrder(false)
  }
  
  const handleDelete = async (e) =>{
    setLoadingButtonDeleteOrder(true)
    e.preventDefault()
    try{
      const apiData = await api('get',`/Order/DeleteOrder?token=${localStorage.getItem('authToken-oilyfan')}&order_id=${order.id}`,{})
      if(apiData){
        window.location.href = '/pages/admin/orders'
      }
    }catch(err){

    }
    setLoadingButtonDeleteOrder(false)
  }

  const handleDeleteProperty = async (e,val) =>{
    e.preventDefault()
    try{
      const newProperties = []
      for(const property of order.properties){
        if(property.id !== val.id){
          newProperties.push(property)
        }
      }
      
      const orderAPI = await api('get',`/Order/EditOrder?token=${localStorage.getItem('authToken-oilyfan')}&order_id=${order.id}&status=${order.status}&name=${order.name}&description=${order.description}&properties=${encodeURIComponent(JSON.stringify(newProperties))}`,{})
      if(orderAPI){
        window.location.reload()
      }
    }catch(err){

    }
  }

  const handleAddProperty = async (e,val) => {
    setLoadingButtonAddProperty(true)
    e.preventDefault()
    try{
      if(val.name  && val.kind && (val.kind === 'file' ? (val.file?true:false) : (val.value?true:false))){
        
        if(val.kind === 'file'){
          let dataAPI = new FormData();
          dataAPI.append('file',val.file);
          const result = await api('post',`/File/UploadFile?token=${localStorage.getItem('authToken-oilyfan')}`,dataAPI) 
          if(result){
            
            order.properties.push({
              id:val.id,
              name:val.name,
              kind:val.kind,
              unit:val.unit,
              isVisible:val.isVisible,
              value:val.kind === 'file' ? result.data.id : val.value,
              filename:val.kind === 'file' ? result.data.name : '',
            })
            console.log('hi');
            const orderAPI = await api('get',`/Order/EditOrder?token=${localStorage.getItem('authToken-oilyfan')}&order_id=${order.id}&status=${order.status}&name=${order.name}&description=${order.description}&properties=${encodeURIComponent(JSON.stringify(order.properties))}`,{})
            if(orderAPI){
              window.location.reload()
            }
          }
        }else{
          order.properties.push({
            id:val.id,
            name:val.name,
            kind:val.kind,
            unit:val.unit,
            isVisible:val.isVisible,
            value:val.kind === 'file' ? result.data.id : val.value,
            filename:val.kind === 'file' ? result.data.name : '',
          })
          const orderAPI = await api('get',`/Order/EditOrder?token=${localStorage.getItem('authToken-oilyfan')}&order_id=${order.id}&status=${order.status}&name=${order.name}&description=${order.description}&properties=${encodeURIComponent(JSON.stringify(order.properties))}`,{})
          if(orderAPI){
            window.location.reload()
          }
        }
      }else{
        setError('Fill All Parameter')
      }
      setLoadingButtonAddProperty(false)
    }catch(err){
      console.log(err);
    }
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
            <Head >
              <title>{`Oilyfan - Show Order`}</title>
              <meta
                name='description'
                content={`Oilyfan - Show Order`}
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
                      <OrderBoolAscendingVariant/>
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
                {
                  edit?
                  (
                    <OrderForm2 loadingButton={loadingButtonUpdateOrder} order={order} handleEdit={(e) => handleEdit(e,false)} onChangeOrder={(key,val) => handleOrderDataEdit(key,val)} userSelect={false} handleUpdate={(e) => updateOrderData(e)}/>
                  ):
                  (
                    <OrderShow loadingButton={loadingButtonDeleteOrder} order={order} handleEdit={(e) => handleEdit(e,true)} handleDelete={(e) => handleDelete(e)}/>
                  )
                }
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='properties'>
                <OrderProperty2 loadingButton={loadingButtonAddProperty} order={order} onChangePropertyOrder={(e,key,id)=>onChangePropertyOrder(e,key,id)} handleDelete={(e,val) => handleDeleteProperty(e,val)} handleAddProperty={(e,val) =>handleAddProperty(e,val) }/>
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
