import TrafficLocation from "../../components/traffic_location/TrafficLocation";
import { makeStyles } from "@material-ui/core/styles";
import Phone from "../../components/phone/Phone";
import TLRButton from "../../components/tlr_button/TLRButton";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { ReactComponent as AppLogo } from "../../assets/yugastore-logo.svg";

const useStyles = makeStyles((theme) => {
  return {
    landingWrapper: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      height: "600px",
      width: "100%",
      display: "flex",
      flex: "1 1 auto",
      flexDirection: "column",
      alignItems: "center",
      //   justifyContent: "center",
      overflow: "scroll",
    },
    landingHeader: {
      flexBasis: "300px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
    },
    logo: {
      height: "88px",
      width: "88px",
    },
    appHeading: {
      color: theme.palette.text.primaryPurple,
      fontSize: "30px",
      fontWeight: "500",
    },
    landingContent: {
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
    },
    instructions: {
      textAlign: "center",
      width: "80%",
    },
  };
});

export default function Landing() {
  const classes = useStyles();
  let navigate = useNavigate();
  return (
    <Phone>
      <div className={classes.landingWrapper}>
        <div className={classes.landingHeader}>
          <AppLogo className={classes.logo} />
          <Typography className={classes.appHeading}>Yuga Bookstore</Typography>
        </div>
        <div className={classes.landingContent}>
          <Typography color="textSecondary" className={classes.instructions}>
            Set your phone's location to browse our selection of books.
          </Typography>
          <TrafficLocation />
          <TLRButton
            styles={{ alignSelf: "center", width: "80%" }}
            text={"Get Started"}
            onClick={() => {
              navigate("/store/products");
            }}
          />
        </div>
      </div>
    </Phone>
  );
}
