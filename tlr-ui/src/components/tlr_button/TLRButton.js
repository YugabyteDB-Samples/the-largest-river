import { makeStyles, Typography } from "@material-ui/core";
const useStyles = makeStyles((theme) => {
  return {
    button: {
      backgroundColor: theme.palette.background.purple,
      border: "white",
      borderRadius: "20px",
      color: "white",
      padding: "10px",
      fontSize: "13px",
      fontWeight: "600",
      "&:hover": {
        backgroundColor: theme.palette.background.purple1,
        cursor: "pointer",
      },
      "&:disabled": {
        cursor: "auto",
        backgroundColor: theme.palette.grey[400],
        "&:hover": {
          cursor: "auto",
          backgroundColor: theme.palette.grey[400],
        },
      },
    },
  };
});
export default function TLRButton(props) {
  const classes = useStyles();
  const { text, onClick, styles = {}, disabled } = props;
  return (
    <button
      className={classes.button}
      style={styles}
      onClick={onClick}
      disabled={disabled}
    >
      <Typography>{text}</Typography>
    </button>
  );
}
