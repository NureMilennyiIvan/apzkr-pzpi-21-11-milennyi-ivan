import { useNavigate } from 'react-router-dom';
import { useEffectUser } from './utils/helpers';
import { IUserProps } from './components/properties/IUserProps';
import { UserRole } from './utils/UserRole';
import AuthorizationForm from './components/common/AuthorizationForm';
import { ShepherdMainPage } from './components/shepherd/ShepherdMainPage';
import { StorekeeperMainPage } from './components/storekeeper/StorekeeperMainPage';
import { AdminMainPage } from './components/admin/AdminMainPage';

const App: React.FC<IUserProps> = ({user, setUser}) => {
  const navigate = useNavigate();
  useEffectUser(user, navigate);

  return (
      <div>
        {user.Role === UserRole.Unauthorized && (
          <AuthorizationForm user={user} setUser={setUser}/>
        )}
        {user.Role === UserRole.Shepherd && (
          <ShepherdMainPage user={user} setUser={setUser}/>
        )}
        {user.Role === UserRole.Storekeeper && (
          <StorekeeperMainPage user={user} setUser={setUser}/>
        )}
        {user.Role === UserRole.Admin && (  
          <AdminMainPage/>
        )}        
      </div>
  )
}

export default App
