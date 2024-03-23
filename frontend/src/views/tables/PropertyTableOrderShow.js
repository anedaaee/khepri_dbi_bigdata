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
import { API_KEY } from 'src/config'
import { CheckCircleOutline} from 'mdi-material-ui'


const PropertyTableOrderShow = (props) => {
  const [properties,setProperties] = useState([])
  
  useEffect(() => {
    try{
      setProperties(props.properties)
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='left'>Name</TableCell>
            <TableCell align='left'>Kind</TableCell>
            <TableCell align='left'>Value</TableCell>
            <TableCell align='left'>Unit</TableCell>
            <TableCell align='center'>Visible For User</TableCell>
            <TableCell align='center'>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {properties.map(row => (
            <TableRow key={row.id}>
              <TableCell align='left' component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='left'>{row.kind}</TableCell>
              <TableCell align='left'>{row.kind === 'file'?
                <Link href={`${API_KEY}/File/DownloadFile?token=${localStorage.getItem('authToken-oilyfan')}&file_id=${row.value}`}>
                {row.filename}
                </Link>
              :row.value}</TableCell>

                <TableCell align='left'>{row.unit?row.unit:'---'}</TableCell>
                <TableCell align='center'>{row.isVisible?<CheckCircleOutline style={{color:'#04aa6d'}}/>:'---'}</TableCell>
                <TableCell align='center'>
                    <Link style={{cursor:"pointer"}} onClick={(e) => props.handleDelete(e,row)}>
                        {'Delete'}
                    </Link>  
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PropertyTableOrderShow
