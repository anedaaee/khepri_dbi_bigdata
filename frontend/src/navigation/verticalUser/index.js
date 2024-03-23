// ** Icon imports

import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import { OrderBoolAscendingVariant,PlusBoxOutline ,CheckAll , ProgressHelper} from 'mdi-material-ui'

import themeConfig from 'src/configs/themeConfig'

const navigation2 = () => {
    return [
      {
        title: 'Dashboard',
        icon: HomeOutline,
        path: '/pages/user'
      },
      {
        title: 'All Orders',
        icon: OrderBoolAscendingVariant,
        path: '/pages/user/orders'
      },
      {
        sectionTitle: 'orders'
      },
      {
        title: 'In Progress',
        icon: PlusBoxOutline,
        path: '/pages/user/inProgress-order',
      },
      {
        title: 'Completed Order',
        icon: ProgressHelper,
        path: '/pages/user/completed-order',
      },
    ]
  
}

export default navigation2
