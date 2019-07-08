import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/PersonOutlineRounded';
import { connect } from 'react-redux';

import DrawerMenuItems from './MenuItems';
import Search from './Search';

const drawerWidth = 230;
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    height: '65px',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  backgroundColor: '#035aa6'
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 1,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  search: {
    height: '80%',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 1,
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(10),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1.5),
  },
  inputRoot: {
    color: 'inherit',
    height: '100%'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 5),
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: 16,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 200,
      '&:focus': {
        width: 350,
      },
    },
  },
  sectionDesktop: {
    display: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing( 2, 2, 2, 2),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const renderAvatar = (classes) => {
  return (
  <>
  <div className={classes.grow} />
  <div className={classes.sectionDesktop}>
    <IconButton
      aria-owns={'material-appbar' }
      aria-haspopup="true"
      // onClick={this.handleProfileMenuOpen}
      color="inherit"
    >
      <Avatar>
        <PersonIcon />
      </Avatar>
    </IconButton>
  </div> 
  </>
  )
}

const TopAppBar = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  let windowsize = window.innerWidth
  const [open, setOpen] = useState(windowsize < 769 ? false : true ) 
  const [mobile] = useState(windowsize < 769 ? false : true)
  const  handleDrawerOpen = () => {
    setOpen(true); props.onDrawerOpen(open)
  } 
  function handleDrawerClose() {
    setOpen(false); props.onDrawerOpen(open)
  }
  useEffect(() => {
    props.onDrawerOpen(open)
  }, [props, open])
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            {/* <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            /> */}
                 <Search />
          </div>
          {mobile ? renderAvatar(classes): <> </>}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
        <Typography > EMR &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <DrawerMenuItems />
        </List>
      </Drawer>
      <main className={classes.content}></main>
    </div>
  );
}
const mapDispatchtoProps = dispatch => {
  return {
    onDrawerOpen: (options) => dispatch ({type: 'DrawerOpen', val: options})
  }
}
export default connect (null, mapDispatchtoProps)(TopAppBar);

