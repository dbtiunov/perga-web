import React, { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';

import { useAuth } from '@contexts/hooks/useAuth.ts';

const DemoSignin: React.FC = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();

  // Auto sign-in with demo credentials when component mounts
  useEffect(() => {
    const autoSignin = async () => {
      try {
        await signin({ username: 'demo', password: 'demo' });
        navigate('/planner/');
      } catch {
        window.location.href = 'https://app.getperga.me';
      }
    };

    autoSignin();
  }, [signin, navigate]);

  return '';
};

export default DemoSignin;
