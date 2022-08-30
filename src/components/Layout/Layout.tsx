import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Footer, Header } from '@pagopa/selfcare-common-frontend';
import { useSelector } from 'react-redux';
import React from 'react';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { ENV } from '../../utils/env';

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const onExit = useUnloadEventOnExit();
  const loggedUser = useSelector(userSelectors.selectLoggedUser);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'space-between',
      }}
    >
      <Header
        withSecondHeader={false}
        onExit={onExit}
        assistanceEmail={ENV.ASSISTANCE.ENABLE ? ENV.ASSISTANCE.EMAIL : undefined}
        enableLogin={true}
        loggedUser={
          loggedUser
            ? {
                id: loggedUser ? loggedUser.uid : '',
                name: loggedUser?.name,
                surname: loggedUser?.surname,
                email: loggedUser?.email,
              }
            : false
        }
      />
      <Grid container>{children}</Grid>
      <Footer onExit={onExit} loggedUser={!!loggedUser} />
    </Box>
  );
}
