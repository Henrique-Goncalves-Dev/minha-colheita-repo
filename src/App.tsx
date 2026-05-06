import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IdentificationScreen } from './screens/identificationScreen';
import { PinScreen } from './screens/pinScreen';
import { HomeScreen } from './screens/homeScreen';
import { PlantioScreen } from './screens/plantioScreen';
import { PlantacaoScreen } from './screens/plantacaoScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IdentificationScreen />} />
        <Route path="/pin" element={<PinScreen />} />
        <Route path="/dashboard" element={<HomeScreen />} />
        <Route path="/plantio" element={<PlantioScreen />} />
        <Route path="/plantacao" element={<PlantacaoScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;