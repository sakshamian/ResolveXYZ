import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Button, Divider } from '@mui/material';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../Modal/LogoutModal';
import UpdateProfileModal from '../Modal/UpdateProfileModal';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Person2Icon from '@mui/icons-material/Person2';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import icon from '../../assets/logo.svg';

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { user, token, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [updateProfileModalOpen, setUpdateProfileModalOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    setAnchorEl(null);
    navigate('/sign-in');
  };

  const handleSignOut = () => {
    setLogoutModalOpen(false);
    signOut();
    navigate('/');
  };

  // Check if user is logged in
  const isLoggedIn = user !== null && token !== null;

  return (
    <AppBar position="sticky" sx={{ background: '#181c23', px: 2 }} >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: '25px', fontWeight: '600', cursor: 'pointer' }} onClick={() => {
            navigate('/');
          }}>
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
                  sx={{ width: 35, height: 35 }} />
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
                  minWidth: 130
                }
              }}
            >
              {
                isLoggedIn ?
                  <>
                    <MenuItem sx={{ fontSize: 16, fontWeight: 600, cursor: 'default' }}>{user.name}</MenuItem>
                    <MenuItem sx={{ fontSize: 16, fontWeight: 600, cursor: 'default' }}>{user.email}</MenuItem>
                    <Divider />
                    <MenuItem sx={{ fontSize: 14 }} onClick={() => {
                      setAnchorEl(null);
                      navigate('/my-posts');
                    }}>
                      <EventNoteIcon fontSize='small' sx={{ paddingRight: '5px' }} />
                      My resolutions
                    </MenuItem>
                    <MenuItem sx={{ fontSize: 14 }} onClick={() => {
                      setAnchorEl(null);
                      setUpdateProfileModalOpen(true);
                    }}>
                      <Person2Icon fontSize='small' sx={{ paddingRight: '5px' }} />
                      Update profile
                    </MenuItem>
                    <MenuItem sx={{ fontSize: 14 }} onClick={() => {
                      setAnchorEl(null);
                      setLogoutModalOpen(true);
                    }}>
                      <LogoutIcon fontSize='small' sx={{ paddingRight: '5px' }} />
                      Sign out
                    </MenuItem>
                  </> :
                  <>
                    <MenuItem sx={{ fontSize: 14 }} onClick={handleSignIn}>
                      <LockOpenIcon fontSize='small' sx={{ paddingRight: '5px' }} />
                      Log in
                    </MenuItem>
                  </>
              }
            </Menu>
          </div>
        </Toolbar>
      </Container>
      <UpdateProfileModal open={updateProfileModalOpen} onClose={() => setUpdateProfileModalOpen(false)} heading="Update your name" defaultName={user?.name} />
      <LogoutModal open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} onLogout={handleSignOut} />
    </AppBar>
  );
}

export default ResponsiveAppBar;

