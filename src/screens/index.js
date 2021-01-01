import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import image1 from "../images/blue.jpeg";

const images = [
  {
    url: image1,
    title: "Add Tutor",
    route: "/addTutor",
    width: "30%",
  },
  {
    url: image1,
    title: "View Tutor",
    route: "/viewTutor",
    width: "30%",
  },
  {
    url: image1,
    title: "Add Student",
    route: "/addStudent",
    width: "30%",
  },
  // {
  //   url: image1,
  //   title: "View Student",
  //   route: "/viewStudent",
  //   width: "30%",
  // },
  {
    url: image1,
    title: "Add Assignment",
    route: "/addAss",
    width: "30%",
  },
  {
    url: image1,
    title: "Add Timed Assignment",
    route: "/addTimeAss",
    width: "30%",
  },
  {
    url: image1,
    title: "All Assignment",
    route: "/allAss",
    width: "30%",
  },
  {
    url: image1,
    title: "In Prgress Assignment",
    route: "/inProgress",
    width: "30%",
  },
  {
    url: image1,
    title: "Done Assignment",
    route: "/doneAss",
    width: "30%",
  },
  {
    url: image1,
    title: "Upcoming Assignment",
    route: "/upAss",
    width: "30%",
  },
  {
    url: image1,
    title: "Due Today",
    route: "/dueToday",
    width: "30%",
  },
  {
    url: image1,
    title: "Due Past",
    route: "/duePast",
    width: "30%",
  },
  {
    url: image1,
    title: "Analytics",
    route: "/analytics",
    width: "30%",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 300,
    width: "100%",
    paddingLeft: "20px",
  },
  image: {
    position: "relative",
    height: 200,
    margin: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
      theme.spacing(1) + 6
    }px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

export default function ButtonBases() {
  const classes = useStyles();
  const onClickHandler = () => {
    console.log("Hello");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div>
      <div className={classes.root}>
        {images.map((image) => (
          <ButtonBase
            focusRipple
            key={image.title}
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            onClick={onClickHandler}
            component={Link}
            to={image.route}
            style={{
              width: image.width,
            }}
          >
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                className={classes.imageTitle}
              >
                {image.title}
                <span className={classes.imageMarked} />
              </Typography>
            </span>
          </ButtonBase>
        ))}
      </div>
    </div>
  );
}






