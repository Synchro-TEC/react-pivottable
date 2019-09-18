import React from 'react';
import tips from './tips';
import {sortAs} from '../src/Utilities';
import TableRenderers from '../src/TableRenderers';
import createPlotlyComponent from 'react-plotly.js/factory';
import createPlotlyRenderers from '../src/PlotlyRenderers';
import PivotTableUI from '../src/PivotTableUI';
import '../src/pivottable.css';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
// import data from 'json-loader!./data.json'
import data from './data';

const Plot = createPlotlyComponent(window.Plotly);
class PivotTableUISmartWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {pivotState: props};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({pivotState: nextProps});
  }

  render() {
    return (
      <PivotTableUI
        renderers={Object.assign(
          {},
          TableRenderers,
          createPlotlyRenderers(Plot)
        )}
        {...this.state.pivotState}
        onChange={s => this.setState({pivotState: s})}
        unusedOrientationCutoff={Infinity}
      />
    );
  }
}

export default class App extends React.Component {
  componentWillMount() {
    this.setState({
      mode: 'demo',
      // filename: 'Sample Dataset: Tips',
      pivotState: {
        data: data,
        rows: ['Region', 'Rep'],
        cols: ['Item'],
        metrics: ['Units', 'Unit Price'],
        // rows: ['Payer Gender'],
        // cols: ['Party Size'],
        // metrics: ['Tip'],
        // aggregatorName: 'Sum over Sum',
        aggregatorName: 'Multiple',
        metricsAggregators: {
          'Unit Price': 'sum',
          Units: 'count',
        },
        // vals: ['Tip', 'Total Bill'],
        rendererName: 'Table',
        // sorters: {
        //    Meal: sortAs(['Lunch', 'Dinner']),
        //   'Day of Week': sortAs(['Thursday', 'Friday', 'Saturday', 'Sunday']),
        //  },
        plotlyOptions: {width: 900, height: 500},
        plotlyConfig: {},
        /* tableOptions: {
          clickCallback: function(e, value, filters, pivotData) {
            var names = [];
            pivotData.forEachMatchingRecord(filters, function(record) {
              names.push(record.Meal);
            });
            alert(names.join('\n'));
          },
        },*/
      },
    });
  }

  //   componentDidMount() {
  //     const file = fs.createReadStream('data.csv');
  //     Papa.parse(file, {
  //       worker: true,
  //       skipEmptyLines: true,
  //       error: e => alert(e),
  //       complete: parsed =>
  //         this.setState({
  //           mode: 'file',
  //           filename: 'data.csv',
  //           pivotState: {data: parsed.data, aggregatorName: 'Multiple'},
  //         }),
  //     });
  //   }

  onDrop(files) {
    this.setState(
      {
        mode: 'thinking',
        filename: '(Parsing CSV...)',
        textarea: '',
        pivotState: {data: []},
      },
      () =>
        Papa.parse(files[0], {
          skipEmptyLines: true,
          error: e => alert(e),
          complete: parsed =>
            this.setState({
              mode: 'file',
              filename: files[0].name,
              pivotState: {data: parsed.data},
            }),
        })
    );
  }

  onType(event) {
    Papa.parse(event.target.value, {
      skipEmptyLines: true,
      error: e => alert(e),
      complete: parsed =>
        this.setState({
          mode: 'text',
          filename: 'Data from <textarea>',
          textarea: event.target.value,
          pivotState: {data: parsed.data},
        }),
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <h2 className="text-center">{this.state.filename}</h2>
          <br />

          <PivotTableUISmartWrapper {...this.state.pivotState} />
        </div>
      </div>
    );
  }
}
