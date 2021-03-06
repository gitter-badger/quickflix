import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import shallowCompare from 'react-addons-shallow-compare';
import truncate from 'lodash.truncate';
import LazyLoad from 'react-lazy-load';
import sanitize from 'sanitize-html';

import Image from './Image';
import styles from './MovieCard.scss';

export default class MovieCard extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    plot: PropTypes.string,
    backdrop: PropTypes.string,
    bitrate: PropTypes.string,
    lazyload: PropTypes.bool,
    season: PropTypes.number,
    sequence: PropTypes.number,
    imdbRating: PropTypes.number,
  };

  static defaultProps = {
    id: 0,
    name: '',
    bitrate: '',
    lazyload: true,
    season: 0,
    sequence: 0,
    imdbRating: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      withinViewport: true,
    };
  }

  componentDidMount() {
    const $ = window.$;
    // $('.tooltipped').tooltip({ delay: 50 });
    $(window).on('scroll', this.onScroll);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    const $ = window.$;
    $(window).off('scroll', this.onScroll);
  }

  onScroll = () => {
    const $ = window.$;
    const windowHeight = $(window).height();
    const cardHeight = this.refs.card.scrollHeight;
    const windowScrollTop = $(window).scrollTop();
    const offsetTop = this.refs.card.offsetTop;
    const OFFSET = 400;

    if ((windowScrollTop - OFFSET <= offsetTop && offsetTop <= windowScrollTop + windowHeight + OFFSET)
      || (windowScrollTop - OFFSET <= offsetTop + cardHeight && offsetTop + cardHeight <= windowScrollTop + windowHeight + OFFSET)) {
      // in
      this.setState({
        ...this.state,
        withinViewport: true,
      });
    } else {
      // out
      this.setState({
        ...this.state,
        withinViewport: false,
      });
    }
  };

  onMouseOver = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      hover: true,
    });
  };

  onMouseOut = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      hover: false,
    });
  };

  onTouchTap = (e) => {
    const $ = window.$;
    const isTargetAButton = $(e.target).hasClass('material-icons');
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    const isOnMobile = deviceWidth < 600;
    if (!isTargetAButton && isOnMobile) {
      const { hover } = this.state;
      this.setState({
        ...this.state,
        hover: !hover,
      });
    }
  };

  play = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { id, plot, backdrop, name, bitrate, season, sequence, lazyload, imdbRating } = this.props;
    const { hover, withinViewport } = this.state;
    const imageNode = lazyload ? (
      <LazyLoad height={189}>
        <Image src={backdrop} />
      </LazyLoad>
    ) : (<Image src={backdrop} />);
    const maskClassName = hover ? `${styles.maskHover}  center-inside` : `${styles.mask} center-inside`;
    const isHD = bitrate.includes('5700') || bitrate.includes('2700');
    const HDText = bitrate.includes('5700') ? '1080p' : '720p';
    const qualityNode = isHD ? (
      <a className="waves-effect waves-red btn-flat" title={HDText} alt={HDText}>
        <i className="material-icons">hd</i>
      </a>
    ) : null;
    const serieText = season > 0 ? `${sequence}` : '';
    const serieNode = season > 0 ? (
      <span>{serieText}</span>
    ) : null;
    const imdbRatingText = imdbRating ? parseFloat(imdbRating).toFixed(1) : '';
    const imdbNode = imdbRating ? (
      <a className="waves-effect waves-red btn-flat" title={`IMDB ${imdbRatingText}`} alt={`IMDB ${imdbRatingText}`}>
        <div className={styles.imdb}><span>{imdbRatingText}</span></div>
      </a>
    ) : null;
    const plotText = sanitize(plot, {
      allowedTags: [],
      allowedAttributes: [],
    });
    const truncatedPlot = truncate(plotText, {
      length: hover ? 200 : 300,
      separator: ' ',
    });

    // const infoNode = (
    //   <Link to={`/movie/${id}`} className="waves-effect waves-red btn-flat" title="Info" alt="Info">
    //     <i className="material-icons">info_outline</i>
    //   </Link>
    // );
    return (
      <div
        ref='card'
        onTouchTap={this.onTouchTap}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        className="card hoverable medium"
        id={`movie-${id}`}
        style={{
          overflow: 'hidden',
          visibility: withinViewport ? 'visible' : 'hidden',
        }}
      >
        <div className="card-image">
          {imageNode}
          <div className={styles.tags}>
            {serieNode}
          </div>
          <div className={maskClassName}>
            <Link to={`/movie/${id}`}
              style={{ opacity: hover ? 1 : 0 }}
              className="btn-floating btn-large waves-effect waves-light red accent-4"
              title="Watch"
              alt="Watch"
            >
              <i style={{ fontSize: 36 }} className="material-icons">play_arrow</i>
            </Link>
          </div>
          <span className="card-title truncate" style={{ maxWidth: '100%' }}>{name}</span>
        </div>
        <div style={{ maxHeight: hover ? '40%' : '60%' }} className="card-content">
          <p>{truncatedPlot}</p>
        </div>
        <div style={{ bottom: hover ? 0 : -100 }} className={`${styles.actions} card-action`}>
          <a className="waves-effect waves-red btn-flat" title="Trailer" alt="Trailer">
            <i className="material-icons">ondemand_video</i>
          </a>
          <a className="waves-effect waves-red btn-flat" title="Add to Favorite" alt="Add to Favorite">
            <i className="material-icons">favorite_border</i>
          </a>
          {qualityNode}
          {imdbNode}
          <a title="Show full plot" alt="Show full plot" className="activator">
            <i className="material-icons right tooltipped" data-position="top" data-tooltip="Show full plot">expand_less</i>
          </a>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">{name}<i className="material-icons right">close</i></span>
          <p>{plotText}</p>
        </div>
      </div>
    );
  }
}
