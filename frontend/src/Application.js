import * as React from "react";
import 'antd/dist/antd.css';
import {Form, Input, Button, DatePicker, Row, Col, Layout, Card} from "antd";
import SubmissionApi from "./api";
import moment from "moment";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts/highstock';

const {Content} = Layout;

//Ideally I should have split the two components, the form and the chart into two different ones nad have this one as a parent, but have no time
class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            symbols: null,
            symbol: null,
            startDate: null,
            ohlc: null,
            volume: null,
            chartOptions: null
        };
    }

    componentDidMount() {
        //Perform API calls here, should be in constructor but can't get it to work
        SubmissionApi.getSymbols().then((res) => {
            this.setState({
                symbols: res.data
            })
        });
    };

    handleSymbolChange = (event) => {
        this.setState({symbol: event.target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                SubmissionApi.getData(values.symbol, values.startDate, values.endDate, values.email).then((res) => {
                    let data = res.data;
                    let ohlc = [];
                    let volume = [];
                    let i = 0;
                    for (i; i < data.length; i++) {
                        ohlc.push([
                            data[i][0], // the date
                            data[i][1], // open
                            data[i][2], // high
                            data[i][3], // low
                            data[i][4] // close
                        ]);

                        volume.push([
                            data[i][0], // the date
                            data[i][5] // the volume
                        ]);
                    }

                    //Set chart options here
                    let groupingUnits = [[
                        'week',                         // unit name
                        [1]                             // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]];

                    let options = {

                        rangeSelector: {
                            selected: 1
                        },

                        title: {
                            text: this.state.symbol + ' Historical'
                        },

                        yAxis: [{
                            labels: {
                                align: 'right',
                                x: -3
                            },
                            title: {
                                text: 'OHLC'
                            },
                            height: '60%',
                            lineWidth: 2,
                            resize: {
                                enabled: true
                            }
                        }, {
                            labels: {
                                align: 'right',
                                x: -3
                            },
                            title: {
                                text: 'Volume'
                            },
                            top: '65%',
                            height: '35%',
                            offset: 0,
                            lineWidth: 2
                        }],

                        tooltip: {
                            split: true
                        },

                        series: [{
                            type: 'candlestick',
                            name: 'AAPL',
                            data: ohlc,
                            dataGrouping: {
                                units: groupingUnits
                            }
                        }, {
                            type: 'column',
                            name: 'Volume',
                            data: volume,
                            yAxis: 1,
                            dataGrouping: {
                                units: groupingUnits
                            }
                        }]
                    };

                    this.setState({
                        ohlc: ohlc,
                        volume: volume,
                        chartOptions: options
                    })
                });
            }
        });
    };


    onStartDateChange = (e) => {
        this.setState({
            startDate: e
        });

    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Layout style={{textAlign: 'left'}}>
                <Content>
                    <Card style={{width: 300}}>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Row>
                                <Form.Item label='Company Symbol'>
                                    {getFieldDecorator('symbol', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please enter a stock symbol!'
                                            },
                                            {
                                                type: "enum",
                                                enum: this.state.symbols,
                                                message: 'Stock symbol does not exist'
                                            }
                                        ],
                                    })(
                                        <Input
                                            value={this.state.symbol}
                                            onChange={this.handleSymbolChange}
                                            placeholder="eg. TSLA"
                                        />
                                    )}
                                </Form.Item>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Item label='From'>
                                        {getFieldDecorator('startDate', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please enter a start date!'
                                                }
                                            ],
                                        })(
                                            <DatePicker
                                                value={this.state.startDate}
                                                onChange={this.onStartDateChange}
                                                disabledDate={(current) => {
                                                    return current && current > moment().subtract(1, 'day');
                                                }}
                                            />
                                        )}

                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item label='To'>
                                        {getFieldDecorator('endDate', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please enter an end date!'
                                                }
                                            ],
                                        })(
                                            <DatePicker
                                                disabled={!this.state.startDate}
                                                disabledDate={(current) => {
                                                    return (current && current < this.state.startDate);
                                                }}
                                            />
                                        )}

                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Item label='Email'>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input your email address!'
                                            },
                                            {
                                                type: 'email',
                                                message: 'Please enter a valid email address!'
                                            }
                                        ],
                                    })(
                                        <Input
                                            placeholder="Email"
                                        />,
                                    )}
                                </Form.Item>
                            </Row>
                            <Row>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Get data
                                    </Button>
                                </Form.Item>
                            </Row>
                        </Form>
                    </Card>
                    {this.state.chartOptions && <HighchartsReact
                        options={this.state.chartOptions}
                        highcharts={Highcharts}
                        constructorType={'stockChart'}
                        allowChartUpdate={true}
                        updateArgs={[true, true, true]}
                        containerProps={{className: 'chartContainer'}}
                    />}
                </Content>
            </Layout>
        );
    }
}

export default Form.create()(Application);
