import * as React from "react";
import 'antd/dist/antd.css';
import {Form, Input, Button, DatePicker, Row, Col, Layout, Card} from "antd";
import SubmissionApi from "./api";

const {Content} = Layout;

class Submission extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            endDateEnabled: false,
            symbols: null
        };
    }

    componentDidMount() {
        //Perform API calls here
        SubmissionApi.getSymbols().then((res) => {
            this.setState({
                symbols: res.data
            }, ()=>{
                console.log(this.state.symbols)
            })
        });
    };


    handleSubmit = (event) => {

    };


    onStartDateChange = () => {

    };

    onEndDateChange = () => {

    };

    onSymbolChange = () => {

    };


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Layout style={{textAlign: 'left'}}>
                <Content style={{padding: '0 30%'}}>
                    <Card style={{width: 300}}>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Row>
                                <Form.Item label='Company Symbol'>
                                    {getFieldDecorator('symbol', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please enter a stock symbol!'
                                            }
                                        ],
                                    })(
                                        <Input
                                            placeholder="eg. TSLA"
                                            onChange={this.onSymbolChange}
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
                                                onChange={this.onStartDateChange}
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
                                                onChange={this.onEndDateChange}
                                                disabled={!this.state.endDateEnabled}
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
                </Content>
            </Layout>

        );
    }
}

export default Form.create()(Submission);
