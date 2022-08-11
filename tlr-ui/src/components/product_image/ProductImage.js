import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => {
  return {
    // backgroundImg: {
    //   width: "150px", //default
    //   height: "150px", //default
    //   backgroundPosition: "50% 50%",
    //   backgroundRepeat: "no-repeat",
    //   backgroundSize: "cover",
    //   borderRadius: "10px",
    //   flexShrink: 0,
    // },
    img: {
      borderRadius: "10px",
      flexShrink: 0,
    },
  };
});
export default function ProductImage(props) {
  const { height, width, imageUrl } = props;
  const classes = useStyles();
  /* <div
      className={classes.backgroundImg}
      style={{
        height: height ? `${height}px` : "",
        width: width ? `${width}px` : "",
        backgroundImage: `url(${imageUrl})`,
      }}
    ></div> */
  return (
    <img
      src={imageUrl}
      height={height || 150}
      width={width || 150}
      className={classes.img}
    />
  );
}
