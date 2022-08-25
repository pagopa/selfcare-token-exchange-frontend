import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { useTranslation, Trans } from 'react-i18next';
import withLogin from '@pagopa/selfcare-common-frontend/decorators/withLogin';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const token = storageTokenOps.read();

  useEffect(() => {
    const productId = new URLSearchParams(window.location.search).get('productId');
    const institutionId = new URLSearchParams(window.location.search).get('institutionId');

    if (productId && institutionId) {
      retrieveProductBackofficeURL(productId, institutionId);
    }
  }, []);

  const retrieveProductBackofficeURL = (productId: string, institutionId: string) => {
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
        console.log(data);
        // eslint-disable-next-line functional/immutable-data
        window.location.href = data;
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
        item
        justifyContent="center"
        alignItems="center"
        display="flex"
        sx={{ backgroundColor: 'rgb(242, 242, 242)', textAlign: 'center' }}
      >
        <Box px={24} my={13}>
          <TitleBox
            title={t('tokenExchangePage.title')}
            mbTitle={1}
            mbSubTitle={4}
            variantTitle="h1"
            variantSubTitle="h5"
            titleFontSize="48px"
          />

          {!error && loading && (
            <Grid
              container
              item
              justifyContent="center"
              alignItems="center"
              display="flex"
              direction="column"
            >
              <Trans i18nKey="tokenExchangePage.subTitle">
                Verrai presto reindirizzato alla pagina desiderata
              </Trans>
              <CircularProgress />
            </Grid>
          )}
          {error && <Trans i18nKey="tokenExchangePage.error"> Qualcosa è andato storto </Trans>}
        </Box>
      </Grid>
    </React.Fragment>
  );
};

export default withLogin(TokenExchange);
