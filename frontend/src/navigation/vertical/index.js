// ** Icon imports

import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import { OrderBoolAscendingVariant,PlusBoxOutline } from 'mdi-material-ui'
import themeConfig from 'src/configs/themeConfig'

const navigation = () => {
  //if(themeConfig.admin){
    return [
      {
        title: 'Dashboard',
        icon: HomeOutline,
        path: '/pages/admin'
      },
      // {
      //   title: 'Orders',
      //   icon: OrderBoolAscendingVariant,
      //   path: '/pages/admin/orders'
      // },
      {
        sectionTitle: 'account'
      },
      {
        title: 'My Data',
        icon: AccountCogOutline,
        path: '/pages/admin/account'
      },
      // {
      //   title: 'Add Order',
      //   icon: PlusBoxOutline,
      //   path: '/pages/admin/add-order',
      // },
      // {
      //   title: 'New User',
      //   icon: AccountPlusOutline,
      //   path: '/pages/admin/new-user',
      // },
    ]

  // }else{
  //   return [
  //     {
  //       title: 'Dashboard',
  //       icon: HomeOutline,
  //       path: '/pages/user'
  //     },
  //   ]
  // }
}

export default navigation
