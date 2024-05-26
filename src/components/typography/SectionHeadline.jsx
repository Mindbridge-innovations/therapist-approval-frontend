import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

function SectionHeadline(props) {
 const { alwaysCenter = false, description, id, inverted = false, overline, title } = props;
 return (
    <Box sx={{ m: alwaysCenter ? 'auto' : 'none' }}>
      {overline && (
        <Typography
          id={id}
          component="h2"
          variant="body2"
          fontWeight="bold"
          color="primary.main"
          sx={{
            mb: 1,
            ...(alwaysCenter && {
              textAlign: 'center',
            }),
          }}
        >
          {overline}
        </Typography>
      )}
      {typeof title === 'string' ? (
        <Typography
          variant="h2"
          sx={(theme) => ({
            maxWidth: 500,
            ...(inverted
              ? {
                 color: '#fff',
                }
              : {
                 color: 'primaryDark.900',
                 ...theme.applyDarkStyles({
                    color: 'grey.100',
                 }),
                }),
            ...(alwaysCenter && {
              textAlign: 'center',
              maxWidth: '100%',
            }),
          })}
        >
          {title}
        </Typography>
      ) : (
        React.cloneElement(title, {
          style: {
            maxWidth: 500,
            ...(alwaysCenter && {
              maxWidth: '100%',
              textAlign: 'center',
            }),
            ...(inverted && {
              color: '#fff',
            }),
          },
        })
      )}
      {description && (
        <Typography
          sx={(theme) => ({
            mt: 1,
            mb: 3,
            maxWidth: 500,
            ...(inverted
              ? {
                 color: 'grey.400',
                }
              : {
                 color: 'grey.800',
                 ...theme.applyDarkStyles({
                    color: 'grey.500',
                 }),
                }),
            ...(alwaysCenter && {
              textAlign: 'center',
              mx: 'auto',
            }),
          })}
        >
          {description}
        </Typography>
      )}
    </Box>
 );
}

SectionHeadline.propTypes = {
 alwaysCenter: PropTypes.bool,
 description: PropTypes.node,
 id: PropTypes.string,
 inverted: PropTypes.bool,
 overline: PropTypes.node,
 title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
 ]).isRequired,
};

export default SectionHeadline;
