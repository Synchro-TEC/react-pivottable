import Draggable from 'react-draggable';
import React from 'react';
import PropTypes from 'prop-types';

const aggregatorsOptions = ['count', 'sum'];

export class DraggableMetric extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  toggleMetric(value) {
    this.props.setMetricAggregator(this.props.name, value);
  }

  getFilterBox() {
    const showMenu =
      Object.keys(this.props.attrValues).length < this.props.menuLimit;

    return (
      <Draggable handle=".pvtDragHandle">
        <div
          className="pvtFilterBox"
          style={{
            display: 'block',
            cursor: 'initial',
            zIndex: this.props.zIndex,
          }}
          onClick={() => this.props.moveFilterBoxToTop(this.props.name)}
        >
          <a onClick={() => this.setState({open: false})} className="pvtCloseX">
            ×
          </a>
          <span className="pvtDragHandle">☰</span>
          <h4>{`Configurações da Métrica`}</h4>

          <p>{`Fonte: ${this.props.name}`}</p>

          {showMenu && (
            <div className="pvtCheckContainer">
              {aggregatorsOptions.map(x => (
                <p
                  key={x}
                  onClick={() => this.toggleMetric(x)}
                  className={
                    this.props.aggregators[this.props.name] === x
                      ? 'selected'
                      : ''
                  }
                >
                  {x}
                </p>
              ))}
            </div>
          )}
        </div>
      </Draggable>
    );
  }

  toggleFilterBox() {
    this.setState({open: !this.state.open});
    this.props.moveFilterBoxToTop(this.props.name);
  }

  render() {
    const filtered =
      Object.keys(this.props.valueFilter).length !== 0
        ? 'pvtFilteredAttribute'
        : '';
    return (
      <li data-id={this.props.name}>
        <span className={'pvtAttr ' + filtered}>
          {`${this.props.aggregators[this.props.name]} ${this.props.name}`}
          <span
            className="pvtTriangle"
            onClick={this.toggleFilterBox.bind(this)}
          >
            {' '}
            ▾
          </span>
        </span>

        {this.state.open ? this.getFilterBox() : null}
      </li>
    );
  }
}

DraggableMetric.defaultProps = {
  valueFilter: {},
};

DraggableMetric.propTypes = {
  setMetricAggregator: PropTypes.func.isRequired,
  aggregators: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  addValuesToFilter: PropTypes.func.isRequired,
  removeValuesFromFilter: PropTypes.func.isRequired,
  attrValues: PropTypes.objectOf(PropTypes.number).isRequired,
  valueFilter: PropTypes.objectOf(PropTypes.bool),
  moveFilterBoxToTop: PropTypes.func.isRequired,
  sorter: PropTypes.func.isRequired,
  menuLimit: PropTypes.number,
  zIndex: PropTypes.number,
};

export class DraggableAttribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false, filterText: ''};
  }

  toggleValue(value) {
    if (value in this.props.valueFilter) {
      this.props.removeValuesFromFilter(this.props.name, [value]);
    } else {
      this.props.addValuesToFilter(this.props.name, [value]);
    }
  }

  matchesFilter(x) {
    return x
      .toLowerCase()
      .trim()
      .includes(this.state.filterText.toLowerCase().trim());
  }

  selectOnly(e, value) {
    e.stopPropagation();
    this.props.setValuesInFilter(
      this.props.name,
      Object.keys(this.props.attrValues).filter(y => y !== value)
    );
  }

  getFilterBox() {
    const showMenu =
      Object.keys(this.props.attrValues).length < this.props.menuLimit;

    const values = Object.keys(this.props.attrValues);
    const shown = values
      .filter(this.matchesFilter.bind(this))
      .sort(this.props.sorter);

    return (
      <Draggable handle=".pvtDragHandle">
        <div
          className="pvtFilterBox"
          style={{
            display: 'block',
            cursor: 'initial',
            zIndex: this.props.zIndex,
          }}
          onClick={() => this.props.moveFilterBoxToTop(this.props.name)}
        >
          <a onClick={() => this.setState({open: false})} className="pvtCloseX">
            ×
          </a>
          <span className="pvtDragHandle">☰</span>
          <h4>{this.props.name}</h4>

          {showMenu || <p>(too many values to show)</p>}

          {showMenu && (
            <p>
              <input
                type="text"
                placeholder="Filter values"
                className="pvtSearch"
                value={this.state.filterText}
                onChange={e =>
                  this.setState({
                    filterText: e.target.value,
                  })
                }
              />
              <br />
              <a
                role="button"
                className="pvtButton"
                onClick={() =>
                  this.props.removeValuesFromFilter(
                    this.props.name,
                    Object.keys(this.props.attrValues).filter(
                      this.matchesFilter.bind(this)
                    )
                  )
                }
              >
                Select {values.length === shown.length ? 'All' : shown.length}
              </a>{' '}
              <a
                role="button"
                className="pvtButton"
                onClick={() =>
                  this.props.addValuesToFilter(
                    this.props.name,
                    Object.keys(this.props.attrValues).filter(
                      this.matchesFilter.bind(this)
                    )
                  )
                }
              >
                Deselect {values.length === shown.length ? 'All' : shown.length}
              </a>
            </p>
          )}

          {showMenu && (
            <div className="pvtCheckContainer">
              {shown.map(x => (
                <p
                  key={x}
                  onClick={() => this.toggleValue(x)}
                  className={x in this.props.valueFilter ? '' : 'selected'}
                >
                  <a className="pvtOnly" onClick={e => this.selectOnly(e, x)}>
                    only
                  </a>
                  <a className="pvtOnlySpacer">&nbsp;</a>

                  {x === '' ? <em>null</em> : x}
                </p>
              ))}
            </div>
          )}
        </div>
      </Draggable>
    );
  }

  toggleFilterBox() {
    this.setState({open: !this.state.open});
    this.props.moveFilterBoxToTop(this.props.name);
  }

  render() {
    const filtered =
      Object.keys(this.props.valueFilter).length !== 0
        ? 'pvtFilteredAttribute'
        : '';
    return (
      <li data-id={this.props.name}>
        <span className={'pvtAttr ' + filtered}>
          {this.props.name}
          <span
            className="pvtTriangle"
            onClick={this.toggleFilterBox.bind(this)}
          >
            {' '}
            ▾
          </span>
        </span>

        {this.state.open ? this.getFilterBox() : null}
      </li>
    );
  }
}

DraggableAttribute.defaultProps = {
  valueFilter: {},
};

DraggableAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  setValuesInFilter: PropTypes.func.isRequired,
  addValuesToFilter: PropTypes.func.isRequired,
  removeValuesFromFilter: PropTypes.func.isRequired,
  attrValues: PropTypes.objectOf(PropTypes.number).isRequired,
  valueFilter: PropTypes.objectOf(PropTypes.bool),
  moveFilterBoxToTop: PropTypes.func.isRequired,
  sorter: PropTypes.func.isRequired,
  menuLimit: PropTypes.number,
  zIndex: PropTypes.number,
};
