// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import { Link } from 'mdi-material-ui'


const DashboardTable = (props) => {
  const clickRow = (e,_id) => {
    e.preventDefault()
    window.location.href = `/pages/admin/show-stock?_id=${_id}`
  }
  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Volume</TableCell>
              <TableCell>Open</TableCell>
              <TableCell>Close</TableCell>
              <TableCell>High</TableCell>
              <TableCell>Low</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map(row => (
              <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>{row.name}</TableCell>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>{row._id}</TableCell>
                <TableCell>{row.volume}</TableCell>
                <TableCell>{parseFloat(row.open.toFixed(4))}$</TableCell>
                <TableCell>{parseFloat(row.close.toFixed(4))}$</TableCell>
                <TableCell>{parseFloat(row.high.toFixed(4))}$</TableCell>
                <TableCell>{parseFloat(row.low.toFixed(4))}$</TableCell>
                <TableCell><Link onClick={(e) => clickRow(e,row._id)}>more...</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default DashboardTable
