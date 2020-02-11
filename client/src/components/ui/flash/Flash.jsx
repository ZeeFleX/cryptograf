import React from 'react';
import { Alert } from 'shards-react';

// Styles
import './index.sass';

const Flash = (props) => {
    const { type, message, visible } = props;
    return (
        <Alert theme={ type } open={ visible }>
            { message }
        </Alert>
    );
};

export default Flash;