import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import { actions as searchActions } from '../../redux/modules/search';

import SearchBar from 'components/SearchBar';
import SearchSuggestionList from 'components/SearchSuggestionList';
import classes from './TopNav.scss';

const mapStateToProps = (state) => ({
  search: state.search,
});
export class TopNav extends React.Component {
  static propTypes = {
    search: PropTypes.object,
    invalidateSuggestions: PropTypes.func.isRequired,
    fetchSearchResults: PropTypes.func.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    search: {},
    invalidateSuggestions: () => {},
    fetchSuggestions: () => {},
    fetchSearchResults: () => {},
  };

  handleSearch = (keyword) => {
    const { fetchSearchResults } = this.props;
    fetchSearchResults(keyword);
    browserHistory.push(`/search/${keyword}`);
  };

  render() {
    const { fetchSuggestions, invalidateSuggestions, search } = this.props;
    const showSuggestion = !search.invalidated && !search.isFetching;
    return (
      <div className={classes.root}>
        <div className="navbar-fixed z-depth-2">
          <nav className="blue accent-3">
            <div className="nav-wrapper row">
              <ul>
                <li>
                  <a href="#"><i className="material-icons">menu</i></a>
                </li>
                <li className={classes.logo}>
                  <Link to="/">
                    <img src="https://www.gstatic.com/images/branding/lockups/2x/lockup_trends_light_color_142x24dp.png" />
                  </Link>
                </li>
                <li className={`col m7 ${classes.searchbar}`}>
                  <SearchBar
                    placeholder='Find Movies or TV Show...'
                    search={this.handleSearch}
                    keyword={search.keyword}
                    suggest={fetchSuggestions}
                    invalidate={invalidateSuggestions}
                    isFetching={search.isFetching}
                  />
                  <SearchSuggestionList
                    suggestions={search.suggestions}
                    show={showSuggestion}
                    keyword={search.keyword}
                  />
                </li>
              </ul>
              <ul className="right hide-on-med-and-down">
                <li><a href="badges.html"><i className="material-icons">view_module</i></a></li>
                <li><a href="collapsible.html"><i className="material-icons">refresh</i></a></li>
                <li><a href="mobile.html"><i className="material-icons">more_vert</i></a></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, searchActions)(TopNav);
