// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Link from '@mui/material/Link'
import { API_KEY } from "../../../src/config";

import api from 'src/@core/utils/api'

const CardInfluencer = (props) => {
  return (
    <Card>
      <CardHeader title={`#${props.data.id} ${props.data.name}`} />
      <CardContent>
        <Typography variant='body2' sx={{ marginBottom: 3.25 }}>
          {
            props.data.description
          }
        </Typography>
        <Typography variant='body2'>
          {
            props.data.kind == 'file'?
            (
              <Link href={`${API_KEY}/File/DownloadFile?token=${localStorage.getItem('authToken-oilyfan')}&file_id=${props.data.value}`}>
                {props.data.filename}
                </Link>
            ):
            (
              <Typography>
                {
                  `${props.data.value} ${props.data.unit}`
                }
              </Typography>
            )
          }
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Button onClick={(e) => props.handleDelete(e)}>Delete</Button>
      </CardActions>
    </Card>
  )
}

export default CardInfluencer
