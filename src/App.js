import './App.css'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Home from '@/pages/Home'
import Article from '@/pages/Article'
import Publish from '@/pages/Publish'
import { Routes, Route} from 'react-router-dom'
import { HistoryRouter, history } from './utils/history'
import { AuthRoute } from './components/AuthRoute'
function App() {
  return (
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          <Route path='/' element={
            <AuthRoute>
              <Layout/>
            </AuthRoute>
          }>
            {/* 二级路由默认页面 */}
            <Route index element={<Home />} />
            <Route path="article" element={<Article />} />
            <Route path="publish" element={<Publish />} />
          </Route>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </div>
    </HistoryRouter>
  )
}

export default App
