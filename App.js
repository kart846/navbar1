
import { Rsmlogin } from './components/rsm/Rsmlogin'
import { Routes,Route } from 'react-router'
import { Asmlogin } from './components/asm/Asmlogin'
import { Store_login } from './components/store/Store_login'
import { Adminlogin } from './components/admin/Adminlogin'
import Navbar from './components/navbar/Navbar'

import "./App.css"



function App() {
  // const [data, setData] = useState([{}])
  // useEffect (()=>{
  //   fetch("/members").then(
  //     res => res.json()
  //   ).then(
  //     data => {
  //       setData(data)
  //       console.log(data)
  //     }
  //   )
  // }, [])
  return (
    <div>
      <Navbar/>
      <Routes>
      
      <Route path='/rsm' element={<Rsmlogin/>}/>
      <Route path='/asm' element={<Asmlogin/>}/>
      <Route path='/store' element={<Store_login/>}/>
      <Route path='/admin' element={<Adminlogin/>}/>
      
      </Routes>
      
    </div>
  )
}

export default App
