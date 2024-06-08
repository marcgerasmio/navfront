import { Routes, Route } from 'react-router-dom';
import Authenticate from './Login/Authenticate.js';
import PDashboard from './FinalPersonnel/PDashboard.js';
import PRegisterIncubatee from './FinalPersonnel/PRegisterIncubatee.js';
import PCreateAccount from './FinalPersonnel/PCreateAccount.js';
import PRegisterMentor from './FinalPersonnel/PRegisterMentor.js';
import PStartupTeams from './FinalPersonnel/PStartupTeams.js';
import PTeamMembers from './FinalPersonnel/PTeamMembers.js';
import PEditProfile from './FinalPersonnel/PEditProfile.js';
import PCompetition from './FinalPersonnel/PCompetition.js';
import PMilestone from './FinalPersonnel/PMilestone.js';
import PDeliverables from './FinalPersonnel/PDeliverables.js';
import PSeedFunding from './FinalPersonnel/PSeedFunding.js';
import PAddCompetition from './FinalPersonnel/PAddCompetition.js';
import PAddSeedFunding from './FinalPersonnel/PAddSeedFunding.js';
import PTbiCategory from './FinalPersonnel/PTbiCategory.js';
import PTeamSubmission from './FinalPersonnel/PTeamSubmission.js';
import IDashboard from './FinalIncubatee/IDashboard.js';
import ITeamMembers from './FinalIncubatee/ITeamMembers.js';
import ICompetition from './FinalIncubatee/ICompetition.js';
import ISeedFunding from './FinalIncubatee/ISeedFunding.js';
import ITeamMilestone from './FinalIncubatee/ITeamMilestone.js';
import IEditProfile from './FinalIncubatee/IEditProfile.js';
import IMentor from './FinalIncubatee/IMentors.js';
import MAddDate from './FinalMentor/MAddDate.js';
import MViewAppointment from './FinalMentor/MViewAppointment.js';
import MEditProfile from './FinalMentor/MEditProfile.js';
import ALogin from './Admin/ALogin.js';
import ADashboard from './Admin/ADashboard.js';
import ARegisterIncubatee from './Admin/ARegisterIncubatee.js';
import ARegisterMentor from './Admin/ARegisterMentor.js';
import ARegisterPersonnel from './Admin/ARegisterPersonnel.js';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Authenticate />} />
      <Route path="/admin" element={<ALogin />} />
      <Route path="/pdashboard" element={<PDashboard />} />
      <Route path="/pregisterincubatee" element={<PRegisterIncubatee />} />
      <Route path="/pcreateaccount" element={<PCreateAccount />} />
      <Route path="/pregistermentor" element={<PRegisterMentor />} />
      <Route path="/pstartupteams" element={<PStartupTeams />} />
      <Route path="/pteammembers" element={<PTeamMembers />} />
      <Route path="/peditprofile" element={<PEditProfile />} />
      <Route path="/pcompetition" element={<PCompetition />} />
      <Route path="/paddcompetition" element={<PAddCompetition />} />
      <Route path="/pmilestone" element={<PMilestone />} />
      <Route path="/pdeliverables" element={<PDeliverables />} />
      <Route path="/pseedfunding" element={<PSeedFunding />} />
      <Route path="/paddseedfunding" element={<PAddSeedFunding />} />
      <Route path="/ptbicategory" element={<PTbiCategory />} />
      <Route path="/pviewsubmission" element={<PTeamSubmission/>}/>
      <Route path="/idashboard" element={<IDashboard />} />
      <Route path="/iteammembers" element={<ITeamMembers />} />
      <Route path="/icompetition" element={<ICompetition />} />
      <Route path="/iseedfunding" element={<ISeedFunding />} />
      <Route path="/iteammilestone" element={<ITeamMilestone />} />
      <Route path="/ieditprofile" element={<IEditProfile />} />
      <Route path="/imentors" element={<IMentor />} />
      <Route path="/madddate" element={<MAddDate />} />
      <Route path="/mviewappointment" element={<MViewAppointment />} />
      <Route path="/meditprofile" element={<MEditProfile />} />
      <Route path="/adashboard" element={<ADashboard />} />
      <Route path="/aregistermentor" element={<ARegisterMentor />} />
      <Route path="/aregisterincubatee" element={<ARegisterIncubatee />} />
      <Route path="/aregisterpersonnel" element={<ARegisterPersonnel />} />
    </Routes>
  );
}

export default App;