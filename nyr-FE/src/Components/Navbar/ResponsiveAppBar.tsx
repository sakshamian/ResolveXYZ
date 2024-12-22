import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button } from '@mui/material';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { user, token, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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
    <AppBar position="static" sx={{ backgroundColor: '#181c23' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* <AdbIcon sx={{ display: 'flex', mr: 1, color: "yellow" }} /> */}
          <Box>
            Resolution Hub
          </Box>
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <AccountCircleIcon sx={{ fontSize: 35, color: '#fff' }} />
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
                    <MenuItem sx={{ fontSize: 14 }} onClick={handleSignOut}>Sign out</MenuItem>
                  </> :
                  <>
                    <MenuItem sx={{ fontSize: 14 }} onClick={handleSignIn}>Sign in</MenuItem>
                    <MenuItem sx={{ fontSize: 14 }} onClick={handleSignUp}>Sign up</MenuItem>
                  </>
              }
            </Menu>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

