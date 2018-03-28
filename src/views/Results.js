import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import Button from '../patterns/Button';
import ResultsTable from '../components/ResultsTable';
import ErrorModal from '../components/ErrorModal';
import ResultsList from '../components/ResultsList';
import ResultsSearchForm from '../components/ResultsSearchForm';
import { downloadCSV, downloadJSON } from '../utils/export';

/**
 * @class Results - Results will be used with the SearchHOC which provides the correct
 * props that Results require (for the search + form). This page is shown once a search
 * has been made (or the user goes directly to /Results). In addition to showing the
 * search results, it shows an edit search form.
 */
class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listView: false,
      showFilter: false,
    };
  }
  newSearch = () => {
    // We need to clear the form values before redirecting the user
    this.props.onClear();
    browserHistory.push('/Home');
  }
  render() {
    const capped = (<div style={{ marginLeft: '5px' }} className="badge badge--amber">CAPPED</div>);
    const numResults = this.props.results.length;
    return (
      <section>
        <div className="landscape-search">
          <div className="wrapper">
            <div className="group">
              <div className="col-12 minus-margin">
                <p className="saturn">Edit search</p>
              </div>
            </div>
          </div>
          <ResultsSearchForm
            currentlySending={this.props.currentlySending}
            initialValues={this.props.query}
            onSubmit={this.props.onSubmit}
            onChange={this.props.onChange}
            onClear={this.props.onClear}
            value={this.props.query}
          />
        </div>
        <div className="main-content">
          <div className="wrapper">
            <div className="group">
              <div className="col-8">
                <h1 id="homeTitle" className="jupiter remove-margin">Search results</h1>
                {numResults !== 0 &&
                  <div className="field--toggle" style={{ float: 'right' }}>
                    <label className="label label--inline venus field__label" htmlFor="rangeToggle">List View</label>
                    <input id="rangeToggle" checked={this.state.listView} onChange={() => this.setState({ ...this.state, listView: !this.state.listView })} className="field__input input input--checkbox" type="checkbox" />
                  </div>
                }
                {!this.props.currentlySending &&
                  <p className="mars">We&apos;ve found {numResults} {(numResults > 1 || numResults === 0) ? 'businesses' : 'business'} {(numResults === 10000) ? capped : null}</p>
                }
                <div className="key-line"></div>
                {(numResults !== 0 && this.state.listView) &&
                  <ResultsList results={this.props.results} toHighlight={this.props.toHighlight} />
                }
                {(numResults !== 0 && !this.state.listView) &&
                  <ResultsTable
                    toHighlight={this.props.toHighlight}
                    convertBands
                    results={this.props.results}
                    showFilter={this.state.showFilter}
                    showPagination
                    defaultPageSize={10}
                  />
                }
              </div>
            </div>
            {numResults > 0 &&
              <div>
                <div className="key-line-download"></div>
                <h3 className="saturn">Download your search results</h3>
                <Button className="btn btn--primary venus btn--wide" id="downloadCsvButton" type="submit" text="CSV" onClick={() => downloadCSV(this.props.results)} ariaLabel="Download CSV Button" loading={false} />
                &nbsp;
                <Button className="btn btn--primary venus btn--wide" id="downloadJsonButton" type="submit" text="JSON" onClick={() => downloadJSON(this.props.results)} ariaLabel="Download JSON Button" loading={false} />
              </div>
            }
          </div>
        </div>
        <ErrorModal show={this.props.showError} message={this.props.errorMessage} close={this.props.closeModal} />
      </section>
    );
  }
}

Results.propTypes = {
  currentlySending: PropTypes.bool.isRequired,
  query: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  showError: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  toHighlight: PropTypes.string.isRequired,
};

export default Results;
