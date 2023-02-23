import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
// import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { Trans } from 'react-i18next';
import withLogin from '@pagopa/selfcare-common-frontend/decorators/withLogin';
import { IllusError } from '@pagopa/mui-italia';
import { ENV } from '../../utils/env';

export type AssistanceRequest = {
  name?: string;
  surname?: string;
  email?: string;
  emailConfirm?: string;
  message: string;
  messageObject: string;
};

const TokenExchange = () => {
  // const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const token = storageTokenOps.read();
  const token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF8yNDpiMjo0ODpmZTo3MTpjNTplMzoxOTo1Nzo1ODowYzphNzoxNTo5NDplZDphMyJ9.eyJlbWFpbCI6ImRtYXJ0aW5vQGxpdmUuY29tIiwiZmFtaWx5X25hbWUiOiJMb25nbyIsImZpc2NhbF9udW1iZXIiOiJMTkdNTEU4NVAxOUM4MjZKIiwibmFtZSI6IkVtaWxpYSIsImZyb21fYWEiOmZhbHNlLCJ1aWQiOiJiOWI4OWVmOS00ZGNiLTRlMjctODE5Mi1kOTcyZWZlZjYxNGUiLCJsZXZlbCI6IkwyIiwiaWF0IjoxNjc3MTYxNDkyLCJleHAiOjE2NzcxOTM4OTIsImF1ZCI6ImFwaS51YXQuc2VsZmNhcmUucGFnb3BhLml0IiwiaXNzIjoiU1BJRCIsImp0aSI6IjAxR1NaOVRXQTE2RzM2ODBGNjdIM0FQNk00In0.tTvKzzQTt721T3BRX65-PjRxKZSRWDZ1TDxwcabwWvw20TkDbBBu1iY1blIVnkC8hnbfQKPESmDd8hjVC5FfYCA6s5urBHbCjHBc1q363gP4SshmrG6qRCsoZktuBwkVe-qs4QzuOvscnmGlzAXepGfMAGCxbPDE2MtZpNDejLXV33duFh4no62V3OuRewrQHpb9dU19pAWjnat4WV1lFSSBe1R5KPs71LLJ2n_njqU2feuJAY31jOvXwHyg8Hcw6H7fHyeMSiFZuKjV-KY2xA1qgKIMjzsV0mJjTIDNCRnRkhSzR6mqkdI62fSNANSZdFeN5FEWnt_7t2rjYozMvw';

  useEffect(() => {
    const productId = new URLSearchParams(window.location.search).get('productId');
    const institutionId = new URLSearchParams(window.location.search).get('institutionId');

    if (productId && institutionId) {
      retrieveProductBackofficeURL(productId, institutionId);
    }
  }, []);

  const retrieveProductBackofficeURL = (productId: string, institutionId: string) => {
    const uuid = new URLSearchParams(window.location.search).get('uid');
    setLoading(true);
    fetch(
      `${ENV.URL_API.API_DASHBOARD}/products/${productId}/back-office?institutionId=${institutionId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong');
      })
      .then((data) => {
        console.log('data: ', data);
        // eslint-disable-next-line functional/immutable-data, sonarjs/no-nested-template-literals
        window.location.href = `${data}${uuid ? `?uid=${uuid}` : ''}`;
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <React.Fragment>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        display="flex"
        sx={{
          backgroundColor: 'rgb(242, 242, 242)',
          textAlign: 'center',
          height: '76vh',
        }}
      >
        <Box px={24} my={13} width="100%">
          {!error && loading && (
            <Grid
              item
              xs={12}
              justifyContent="center"
              alignItems="center"
              display="flex"
              id="tokenExchange"
            >
              <CircularProgress />
            </Grid>
          )}
          {error && (
            <>
              <IllusError size={60} />
              <Grid container direction="column" key="0" mt={3}>
                <Grid container item justifyContent="center">
                  <Grid item xs={6}>
                    <Typography variant="h4">
                      <Trans i18nKey="tokenExchangePage.error.title">
                        Qualcosa è andato storto
                      </Trans>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item justifyContent="center" mb={3} mt={1}>
                  <Grid item xs={8}>
                    <Typography>
                      <Trans i18nKey="tokenExchangePage.error.subtitle">
                        A causa di un errore del sistema non è possibile completare <br />
                        la procedura. Ti chiediamo di riprovare più tardi.
                      </Trans>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item justifyContent="center">
                  <Grid item xs={4}>
                    <Button
                      onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
                      variant={'contained'}
                    >
                      <Typography width="100%" sx={{ color: 'primary.contrastText' }}>
                        <Trans i18nKey="onBoardingSubProduct.genericError.homeButton">
                          Torna alla home
                        </Trans>
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Grid>
    </React.Fragment>
  );
};

export default withLogin(TokenExchange);
