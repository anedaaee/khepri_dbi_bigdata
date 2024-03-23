// ** MUI Imports
import { useState, Fragment ,useEffect} from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import api from 'src/@core/utils/api'
import Link from '@mui/material/Link'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))



const UserTable = () => {
  const [loading,setLoading] = useState(true)
  const [userData,setUserData] = useState([])
  
  const fetchData = async() => {
    try{
      const ordersDataAPI = 
        await api('get',
                `/User/GetUsers?token=${localStorage.getItem('authToken-oilyfan')}`,{})
        
      
      console.log(ordersDataAPI.data.users);
      setUserData(ordersDataAPI.data.users)
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
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Username</TableCell>
                  <TableCell align='left'>Password</TableCell>
                  <TableCell align='left'>Name</TableCell>
                  <TableCell align='left'>Mobile</TableCell>
                  <TableCell align='center'>Created At</TableCell>
                  <TableCell align='center'>Modified At</TableCell>
                  <TableCell align='center'>Last Login</TableCell>
                  <TableCell align='center'>Admin</TableCell>
                  <TableCell align='center'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map(row => (
                  <TableRow key={row.id}>
                    <TableCell align='left' component='th' scope='row'>
                      {row.username}
                    </TableCell>
                    <TableCell align='left'>{row.password}</TableCell>
                    <TableCell align='left'>{row.firstname} {row.lastname}</TableCell>
                    <TableCell align='left'>{row.mobileNo?row.mobileNo:'---'}</TableCell>
                    <TableCell align='center'>{formatDate(row.createdAt)}</TableCell>
                    <TableCell align='center'>{formatDate(row.modifiedAt)}</TableCell>
                    <TableCell align='center'>{formatDate(row.lastLogin)}</TableCell>
                    <TableCell align='center'>{row.adminPrivilage?'yes':'no'}</TableCell>
                    <TableCell align='center'>
                      <Link href={`/pages/admin/show-user?id=${row.id}`}>
                      Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
    </div>
    
  )
}

export default UserTable
