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



const UserTable = (props) => {
  
  
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
                  <TableCell align='left'>Stock Id</TableCell>
                  <TableCell align='left'>Number</TableCell>
                  <TableCell align='left'>Date</TableCell>
                  <TableCell align='left'>purchase/sale</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.purchase.map(row => (
                  <TableRow key={row._id}>
                    <TableCell align='left'>{row.stock}</TableCell>
                    <TableCell align='left'>{row.number}</TableCell>
                    <TableCell align='left'>{formatDate(row._id)}</TableCell>
                    <TableCell align='left'>{row.purchaseORsale}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
  )
}

export default UserTable
