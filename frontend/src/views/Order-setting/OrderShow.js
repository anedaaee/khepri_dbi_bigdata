// ** React Imports
import { useState , useEffect} from 'react'
import api from 'src/@core/utils/api'

import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import { LoadingButton } from '@mui/lab'


const OrderShow= (props) => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [users,setUsers] = useState([])

  const fetchData = async() => {
    try{
      const userData = await api('get',
        `/User/GetUsers?token=${localStorage.getItem('authToken-oilyfan')}`,{})
      
      setUsers(userData.data.users)
    }catch(err){  
      console.log(err);
    }
  }
  useEffect(()=>{
    try{
      fetchData()
    }catch(err){

    }
  },[])
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
   
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    };
 
    const statusObj = {
    ['-1']: { color: 'error' ,name:'Declined'},
    ['0']: { color: 'warning' ,name:'Pending'},
    ['1']: { color: 'secondary' ,name:'In Progress'},
    ['2']: { color: 'success' ,name:'Completed'}
  }
  
  return (
    <CardContent sx={{ paddingBottom: 0 }}>
      <form>
        <Grid item xs={6} sm={12}>
            {
              props.order.status!==undefined?
              (
                <Chip
                  label={statusObj[props.order.status].name}
                  color={statusObj[props.order.status].color}
                  sx={{
                    height: 36,
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { fontWeight: 500 }
                  }}
                />
              ):
              (
                <p>{JSON.stringify(props.order.status)}</p>
              )
            }
            
          </Grid>
        <Grid container spacing={.5}>
          <Grid item xs={6} sm={6}>
            <h3>Name : <span style={{color:'#939393',fontWeight:'lighter'}}>{props.order.name}</span></h3>
          </Grid>
          <Grid item xs={6} sm={6}>
            <h3>Code : <span style={{color:'#939393',fontWeight:'lighter'}}>{props.order.trackingCode}</span></h3>
          </Grid>
          
          
          
          
          <Grid item xs={6} sm={6}>
            <h3>Create Date : <span style={{color:'#939393',fontWeight:'lighter'}}>{formatDate(props.order.createdAt)}</span></h3>
          </Grid>
          <Grid item xs={6} sm={6}>
            <h3>ModifiedAt Date : <span style={{color:'#939393',fontWeight:'lighter'}}>{formatDate(props.order.modifiedAt)}</span></h3>
          </Grid>
          <Grid item xs={6} sm={6}>
            <h3>Description : <span style={{color:'#939393',fontWeight:'lighter'}}>{props.order.description}</span></h3>
          </Grid>
          <Grid item xs={6} sm={6}>
            <h3>Owner : <span style={{color:'#939393',fontWeight:'lighter'}}>{props.order.owner}</span></h3>
          </Grid>
          <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                <LoadingButton loading={props.loadingButton} variant='contained' style={{backgroundColor:'transparent',border:'1px solid red',color:'red'}} sx={{ marginRight: 3.5 }} onClick={(e) => props.handleDelete(e)}>
                    Delete Order
                </LoadingButton>
                <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={(e) => props.handleEdit(e)}>
                    Edit
                </Button>
                
              </div>
        </Grid>
      </form>
    </CardContent>
  )
}

export default OrderShow
