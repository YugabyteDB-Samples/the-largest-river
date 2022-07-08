import React, { FC } from 'react';
import {
  AppBar,
  Box,
  makeStyles,
  MenuItem,
  Toolbar,
  Divider,
  Typography,
  IconButton,
  Link as MUILink
} from '@material-ui/core';
import {  Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// import { YBDropdown } from '../components/YBDropdown/YBDropdown';
// import { ClusterBreadcrumbs } from '@app/features/clusters/ClusterBreadcrumbs';
import {ReactComponent as SlackIcon } from '../assets/slack.svg';

const useStyles = makeStyles((theme) => ({
  divider: {
    width: `calc(100% - ${theme.spacing(4)}px)`
  },
  toRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center'
  },
  sendFeedback: {
    color: theme.palette.grey[600],
    display: 'flex',
    paddingRight: theme.spacing(1.5)
  },
  menuIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.grey[600]
  },
  userNameItem: {
    height: 'auto',
    '&:hover,&:focus': {
      backgroundColor: 'unset',
      cursor: 'default'
    }
  }
}));

const LINK_DOCUMENTATION = 'https://docs.yugabyte.com/preview/explore/';
export const LINK_SUPPORT = 'https://support.yugabyte.com/hc/en-us/requests/new?ticket_form_id=360003113431';
const LINK_SLACK = 'https://yugabyte-db.slack.com/';

export const Header: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  // const history = useHistory();
  // const queryClient = useQueryClient();

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <div className={classes.toRight}>
          <Box display="flex">
            <MUILink className={classes.sendFeedback} href={LINK_SLACK} target="_blank">
              <SlackIcon  className={classes.menuIcon} />
              <Typography variant="body2">{t('common.joinSlack')}</Typography>
            </MUILink>
          </Box>
        </div>
        <Divider orientation="horizontal" variant="middle" absolute className={classes.divider} />
      </Toolbar>
    </AppBar>
  );
};
