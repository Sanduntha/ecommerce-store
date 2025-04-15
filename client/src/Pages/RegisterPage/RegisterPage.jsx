import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Link,
  CssBaseline,
  Avatar,
  Checkbox,
  FormControlLabel,
  Paper,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
            }}
          >
            {isLoggedIn ? (
              <WelcomePage user={user} onLogout={() => setIsLoggedIn(false)} />
            ) : (
              <>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                  <Tab label="Login" icon={<LockOutlinedIcon />} />
                  <Tab label="Register" icon={<PersonAddIcon />} />
                </Tabs>
                {activeTab === 0 ? (
                  <LoginForm onLoginSuccess={(userData) => {
                    setIsLoggedIn(true);
                    setUser(userData);
                  }} />
                ) : (
                  <RegisterForm onRegisterSuccess={() => setActiveTab(0)} />
                )}
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('authToken', data.token);
        }
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        }
        label="Remember me"
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

const RegisterForm = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Please login.');
        setTimeout(() => onRegisterSuccess(), 1500);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
          {success}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Register
      </Button>
    </Box>
  );
};

const WelcomePage = ({ user, onLogout }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main', margin: '0 auto' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Welcome, {user?.name || 'User'}!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        You have successfully logged in to our e-commerce platform.
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={onLogout}
      >
        Logout
      </Button>
    </Box>
  );
};