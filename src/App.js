import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
// import logo404 from './assets/404.jpeg'

function App() {
  return (
      <>
          <div>
              <Toaster
                  position="top-right"
                  toastOptions={{
                      success: {
                          theme: {
                              primary: '#4aed88',
                          },
                      },
                  }}
              ></Toaster>
          </div>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Home />}></Route>
                  <Route
                      path="/editor/:roomId"
                      element={<EditorPage />}
                  ></Route>
                   {/* <Route path='*' element={<Image src={logo404} sx={{marginTop : '10%'}} height={'40vh'} fit="contain"/>} /> */}
                    
              </Routes>
          </BrowserRouter>
      </>
  );
}

export default App;
