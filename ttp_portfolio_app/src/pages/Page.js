import React from 'react';

/**
 * All pages + navigation inherit this class.
 * 
 * Expected props in all inheriting classes:
 * action - Should always contain App.js's state adjustment so that we can lift any state up to entire application.
 * appState - Should always contain App.js's state
 */

class Page extends React.Component {
    adjustAppState = (state) => {
        this.props.action(state)
    }
}

export default Page;