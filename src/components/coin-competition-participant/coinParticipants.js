import PropTypes from 'prop-types';
import React from 'react';

const coinParticipants = ({coin}) => (
  <div>
    <img
      alt={coin.name}
      src={coin.logo_url}
      style={{
        height: '24px',
        marginRight: '10px',
        width: '24px',
      }}
    />
    {/* <span>{user.login}</span> */}
  </div>
);

coinParticipants.propTypes = {
  coin: PropTypes.shape({
    logo_url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default coinParticipants;
