import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions as searchActions } from '../../redux/modules/search';
// import classes from './HomeView.scss';

import TopNav from '../TopNav/TopNav';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  search: state.search,
});
export class HomeView extends React.Component {
  static propTypes = {
    search: PropTypes.object,
  };

  static defaultProps = {
    search: {},
  };

  render() {
    return (
      <div>
        <TopNav/>
      </div>
    );
  }
}

export default connect(mapStateToProps, searchActions)(HomeView);
