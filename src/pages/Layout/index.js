import { Layout, Menu, Popconfirm } from 'antd'
import { HomeOutlined, DiffOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation,useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { useEffect } from 'react'
import './index.scss'


const { Header, Sider } = Layout

const GeekLayout = () => {
  // 获取当前路径，以便确定导航栏哪栏高亮
  // 这里是当前浏览器上的路径地址
  const location = useLocation()
  const selectedKey = location.pathname
  // 获取用户名，展示在右上角
  //获取频道列表（Article和Publish都要用，所以抽象到Layout中来）
  const {userStore,loginStore,channelStore} = useStore()
  useEffect(()=>{
    try{
      userStore.getUserInfo()
      channelStore.loadChannelList()
    }catch{ }
  },[userStore,channelStore])
  const usename = window.localStorage.getItem('name')
  //退出登录操作
  const navigate = useNavigate()
  const onLogout = () => {
      loginStore.loginOut()
      navigate('/login')
  }
  
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{usename}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onLogout}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to="/">数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/article">
              <Link to="/article">内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/publish">
              <Link to="/publish">发布文章</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 这里是二级路由的出口 */}
            {/* React提供了Outlet组件，将其用于父组件中可以为子路由的元素占位，并最终渲染子路由的元素。 */}
            <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default GeekLayout