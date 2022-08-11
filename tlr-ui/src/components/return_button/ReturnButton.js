import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { makeStyles, Typography } from "@material-ui/core";
import { ReactComponent as CaretLeftIcon } from "../../assets/caret-left.svg";

const useStyles = makeStyles((theme) => {
  return {
    returnSection: {
      display: "flex",
      alignSelf: "flex-start",
      position: "relative",
      right: "5px",
    },
    return: {
      display: "flex",
      alignItems: "center",
      color: theme.palette.grey[700],
      textDecoration: "none",
      cursor: "pointer",
    },
    caret: {
      color: theme.palette.text.primaryPurple,
      marginRight: "5px",
    },
  };
});
export default function ReturnButton(props) {
  const classes = useStyles();
  const { path } = props; // path passed in special circumstances where back button goes to different location
  const navigate = useNavigate();
  return (
    <div className={classes.returnSection}>
      {path ? (
        <Link to={path} className={classes.return}>
          <CaretLeftIcon className={classes.caret} />
          <Typography variant="body1">Return</Typography>
        </Link>
      ) : (
        <div className={classes.return} onClick={() => navigate(-1)}>
          <CaretLeftIcon className={classes.caret} />
          <Typography variant="body1">Return</Typography>
        </div>
      )}
    </div>
  );
}
