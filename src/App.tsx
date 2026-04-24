import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IdentificationScreen } from './screens/identificationScreen';
import { PinScreen } from './screens/pinScreen';
import { HomeScreen } from './screens/homeScreen'
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IdentificationScreen />} />
        <Route path="/pin" element={<PinScreen />} />
        <Route path="/dashboard" element={<HomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;