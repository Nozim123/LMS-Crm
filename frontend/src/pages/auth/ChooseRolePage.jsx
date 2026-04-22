import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveRole } from '../../features/auth/authSlice';

export default function ChooseRolePage() {
  const roles = useSelector((s) => s.auth.roles);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-2">Choose Role</h2>
        <p className="text-slate-600 mb-4">You have multiple roles. Select your active role for this session.</p>
        <div className="grid grid-cols-1 gap-2">
          {roles.map((role) => (
            <button
              key={role}
              className="btn"
              onClick={() => {
                dispatch(setActiveRole(role));
                navigate('/');
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
