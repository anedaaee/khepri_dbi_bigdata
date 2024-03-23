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
import Button from '@mui/material/Button'
import { LoadingButton } from '@mui/lab'


const OrderForm2 = (props) => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [users,setUsers] = useState([])
  const [order,setOrder] = useState(props.order)
  const [userId,setUserId] = useState('')
  const [username,setUsername] = useState('')
  const [loading,setLoading] = useState(true)
  
  const fetchData = async() => {
    try{
      const userData = await api('get',
        `/User/GetUsers?token=${localStorage.getItem('authToken-oilyfan')}`,{})
        console.log(userData);
      setUsers(userData.data.users)
      setLoading(false)
    }catch(err){  
      console.log(err);
    }
  }
  useEffect(()=>{
    try{
      const queryString = window.location.search          
      const params = new URLSearchParams(queryString)
      const userId = params.get('user_id') 
      const username = params.get('username')
      if(userId){
        setUserId(userId)
        setUsername(username)
        props.onChangeOrder(userId,'user_id')

      }else{
        fetchData()
      }
    }catch(err){

    }
  },[])

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
          <CardContent>
            <form>
              <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                  
              </div>
              <br/>
              <Grid container spacing={7}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Name' placeholder='Order Name' value={props.order.name} defaultValue={props.order.name} onChange={(e) =>props.onChangeOrder(e.target.value,'name')}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Description' placeholder='Description' value={props.order.description} defaultValue={props.order.description} onChange={(e) =>props.onChangeOrder(e.target.value,'description')}/>
                </Grid>
                {
                  userId || !props.userSelect?
                  (
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select label='Status' defaultValue={props.order.status}  onChange={(e) =>props.onChangeOrder(e.target.value,'status')}>
                            <MenuItem value={'-1'}>Declined</MenuItem>
                            <MenuItem value={0}>Pending</MenuItem>
                            <MenuItem value={1}>Proccessing</MenuItem>
                            <MenuItem value={2}>Done</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                  ):(
                    <>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select label='Status' defaultValue={props.order.status}  onChange={(e) =>props.onChangeOrder(e.target.value,'status')}>
                            <MenuItem value={'-1'}>Declined</MenuItem>
                            <MenuItem value={0}>Pending</MenuItem>
                            <MenuItem value={1}>Proccessing</MenuItem>
                            <MenuItem value={2}>Done</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>User</InputLabel>
                          <Select label='User' defaultValue={props.order.user_id} onChange={(e) =>props.onChangeOrder(e.target.value,'user_id')}>
                            {
                              users.map((val,key) => {
                                return(
                                  
                                  <MenuItem key={val.id} value={val.id}>{val.username}</MenuItem>
                                )
                              })
                            }
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )
                }

                

                <Grid item xs={12}>
                </Grid>
              </Grid>
            </form>
              <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                  <Button variant='contained' sx={{ marginRight: 3.5 }} style={{backgroundColor:'transparent',border:'1px solid #939393',color:'#939393'}} onClick={(e) => props.handleEdit(e)}>
                      Cancel
                  </Button>
                  <LoadingButton variant='contained' sx={{ marginRight: 3.5 }} onClick={(e) => props.handleUpdate(e)} loading={props.loadingButton}>
                      Submit
                  </LoadingButton>
              </div>
          </CardContent>
        )
      }
    </div>
    
  )
}

export default OrderForm2
