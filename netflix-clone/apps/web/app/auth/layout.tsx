import { FC } from 'react';
import './auth.css';

/**
 * AuthLayout Component
 * 
 * This component serves as a layout wrapper for all authentication pages.
 * It provides a consistent structure for sign-in and sign-up pages.
 * 
 * @param {React.ReactNode} children - The child components to be rendered within the layout
 */
interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="netflix-auth-page">
      {children}
    </div>
  );
};

export default AuthLayout;
