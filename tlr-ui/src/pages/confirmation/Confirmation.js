import { makeStyles, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import TLRButton from "../../components/tlr_button/TLRButton";
const useStyles = makeStyles((theme) => {
  return {
    confirmationWrapper: {
      display: "flex",
      flex: "1 1 auto",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: theme.spacing(2),
      width: "100%",
      color: theme.palette.grey[900],
    },
  };
});
export default function Confirmation() {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div className={classes.confirmationWrapper}>
      <Typography variant="h4">Order Successful!</Typography>
      <Typography variant="body1">
        We've sent you an email confirmation with a tracking number.
      </Typography>
      <TLRButton
        styles={{ alignSelf: "center", width: "80%" }}
        text={"Keep Shopping"}
        onClick={() => navigate("/store/products")}
      />
    </div>
  );
}
