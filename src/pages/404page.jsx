import * as React from 'react';
import Divider from '@mui/material/Divider';
import BrandingCssVarsProvider from '../styles/BrandingCssVarsProvider';
import NotFoundHero from '../components/NotFoundHero';

export default function Custom404() {
  return (
    <BrandingCssVarsProvider>
      <main id="main-content">
        <NotFoundHero />
        <Divider />
      </main>
    </BrandingCssVarsProvider>
  );
}