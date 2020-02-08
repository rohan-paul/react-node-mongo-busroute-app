import { createMuiTheme } from '@material-ui/core/styles'

const choloTheme = createMuiTheme({
  common: {
    black: '#000',
    white: '#fff',
  },
  shape: {
    borderRadius: '8px',
  },
  background: {
    paper: '#fff',
    headers: '#CECECE',
    default: 'rgba(229, 229, 229, 1)',
  },
  palette: {
    primary: {
      light: 'rgb(254, 124, 0)',
      main: 'rgb(254, 124, 0)',
      dark: '#212121',
    },
    secondary: {
      main: 'rgb(254, 124, 0)',
    },
    error: {
      main: '#ff0000',
      dark: '#212121',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Montserrat',
    h1: {
      fontSize: 33,
      fontFamily: 'Montserrat',
      fontWeight: 300,
      color: 'rgb(254, 124, 0)',
      letterSpacing: '0.0075em',
      verticalAlign: 'middle',
      alignItems: 'center',
    },
    subtitle1: {
      fontSize: 14,
      fontFamily: 'Montserrat',
      color: 'black',
      letterSpacing: '0.0075em',
      fontWeight: 'bold',
      verticalAlign: 'middle',
      alignItems: 'center',
    },
    subtitle2: {
      fontSize: 16,
      fontFamily: 'Montserrat',
      color: 'black',
      letterSpacing: '0.0075em',
      fontWeight: 'bold',
      verticalAlign: 'middle',
      alignItems: 'center',
    },
    h4: {
      fontSize: 14,
      fontWeight: 300,
      fontFamily: 'Montserrat',
      color: 'black',
      letterSpacing: '0.0075em',
      verticalAlign: 'middle',
      alignItems: 'center',
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      fontFamily: 'Montserrat',
      color: 'black',
      letterSpacing: '0.0075em',
      verticalAlign: 'middle',
      alignItems: 'center',
    },
    h3: {
      fontSize: 14,
      fontWeight: 600,
      fontFamily: 'Montserrat',
      color: 'black',
      letterSpacing: '0.0075em',
      verticalAlign: 'middle',
      alignItems: 'center',
    },
  },
})

choloTheme.overrides = {
  MuiDialog: {
    paper: {
      backgroundColor: choloTheme.background.default,
    },
  },
  MuiDialogTitle: {
    root: {
      textAlign: 'center',
    },
  },
  MuiTextField: {
    root: {
      background: choloTheme.background.paper,
      marginTop: choloTheme.spacing(2),
      marginBottom: choloTheme.spacing(3),
      borderRadius: choloTheme.shape.borderRadius,
    },
  },
  MuiInputBase: {
    root: {
      padding: choloTheme.spacing(1),
    },
  },
  MuiFormHelperText: {
    root: {
      backgroundColor: choloTheme.background.default,
      marginTop: '0px',
      padding: choloTheme.spacing(1),
    },
  },
  MuiFormLabel: {
    root: {
      padding: choloTheme.spacing(1),
    },
  },
  WAMuiChipInput: {
    root: {
      background: choloTheme.background.paper,
      marginTop: choloTheme.spacing(2),
      marginBottom: choloTheme.spacing(3),
      borderRadius: choloTheme.shape.borderRadius,
    },
    chipContainer: {
      paddingTop: choloTheme.spacing(1),
      paddingLeft: choloTheme.spacing(1),
      paddingRight: choloTheme.spacing(1),
    },
    helperText: {
      // Only way to avoid space between line and white input are on error
      marginBottom: '-28px',
      paddingTop: choloTheme.spacing(1),
      marginTop: '0px',
    },
  },
  MuiTableCell: {
    // Hacking a bit to get the rounded corners, doesn't look easy to get it without targeting cell
    stickyHeader: {
      borderTopLeftRadius: choloTheme.shape.borderRadius,
      borderTopRightRadius: choloTheme.shape.borderRadius,
    },
  },
  MuiFormControl: {
    root: {
      minWidth: 450,
      width: '100%',
      backgroundColor: 'white',
    },
  },
  MuiButton: {
    root: {
      fontSize: 14,
      fontWeight: 600,
      fontFamily: 'Montserrat',
      letterSpacing: '0.0075em',
    },
  },
}

export default choloTheme
