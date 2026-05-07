import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IdentificationScreen } from './screens/identificationScreen';
import { PinScreen } from './screens/pinScreen';
import { HomeScreen } from './screens/homeScreen';
import { PlantioScreen } from './screens/plantioScreen';
import { PlantacaoScreen } from './screens/plantacaoScreen';
import { TempoPlantacaoScreen } from './screens/tempoPlantacaoScreen';
import { RendaScreen } from './screens/rendaScreen';
import { RegistrarVendaScreen } from './screens/registrarVendaScreen';
import { PerfilScreen } from './screens/perfilScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IdentificationScreen />} />
        <Route path="/pin" element={<PinScreen />} />
        <Route path="/dashboard" element={<HomeScreen />} />
        <Route path="/plantio" element={<PlantioScreen />} />
        <Route path="/plantacao" element={<PlantacaoScreen />} />
        <Route path="/tempo-plantacao" element={<TempoPlantacaoScreen />} />
        <Route path="/renda" element={<RendaScreen />} />
        <Route path="/renda/registrar" element={<RegistrarVendaScreen />} />
        <Route path="/perfil" element={<PerfilScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
