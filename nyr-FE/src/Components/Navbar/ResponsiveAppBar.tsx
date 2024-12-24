import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Box, Button } from '@mui/material';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../Modal/LogoutModal';
import LoginIcon from '@mui/icons-material/Login';

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { user, token, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  const handleSignOut = () => {

    signOut();
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  // Check if user is logged in
  const isLoggedIn = user !== null && token !== null;

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#181c23' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: '20px', fontWeight: '400' }}>
            ResolveXYZ
          </div>
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              {isLoggedIn ?
                <Avatar alt={user.name}
                  src={user.profile}
                  sx={{ width: 40, height: 40 }} />
                :
                <AccountCircleIcon sx={{ fontSize: 35, color: '#fff' }} />}

            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#242936',
                  color: '#fff',
                  minWidth: 200
                }
              }}
            >
              {
                isLoggedIn ?
                  <>
                    <MenuItem sx={{ fontSize: 14 }} onClick={handleClose}>My resolutions</MenuItem>
                    <MenuItem sx={{ fontSize: 14 }} onClick={() => {
                      setAnchorEl(null);
                      setLogoutModalOpen(true);
                    }}>Sign out</MenuItem>
                  </> :
                  <>
                    <MenuItem sx={{ fontSize: 14 }} onClick={handleSignIn}>
                      <LoginIcon />
                      Log in
                    </MenuItem>
                  </>
              }
            </Menu>
          </div>
        </Toolbar>
      </Container>
      <LogoutModal open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} onLogout={handleSignOut} />
    </AppBar>
  );
}
export default ResponsiveAppBar;

