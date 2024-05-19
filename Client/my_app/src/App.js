import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    axios
      .post('http://localhost:3001/start-game')
      .then((response) => {
        setMessages([{ role: 'assistant', content: response.data.content }]);
        setGameState(response.data.gameState);
      })
      .catch((error) => {
        console.error('Error starting the game:', error);
      });

    axios
      .get('http://localhost:3001/game-state')
      .then((response) => {
        setGameState(response.data);
      })
      .catch((error) => {
        console.error('Error fetching game state:', error);
      });
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }]);
      axios
        .post('http://localhost:3001/next-step', {
          role: 'user',
          content: input,
        })
        .then((response) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'assistant', content: response.data.content },
          ]);
          setGameState(response.data.gameState);
        })
        .catch((error) => {
          console.error('Error getting response from the game:', error);
        });
      setInput('');
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <Typography variant='h6' noWrap>
          Details
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>Game State Debug</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {Object.keys(gameState).map((key, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${key}:`}
                    secondary={gameState[key]}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            The Witch is Dead
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='mailbox folders'
      >
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        <Paper sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
          <List>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText primary={message.content} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ display: 'flex', mt: 2 }}>
          <TextField
            label='What do you next?'
            variant='outlined'
            fullWidth
            value={input}
            onChange={handleInputChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleSendMessage}
            sx={{ ml: 1 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
