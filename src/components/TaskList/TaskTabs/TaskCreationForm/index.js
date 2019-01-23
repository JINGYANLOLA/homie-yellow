import React, { Component } from 'react';
import {Row, Col, FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import './index.scss';
import 'react-datepicker/dist/react-datepicker.css';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


export default class TaskCreationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: '',
      taskType: this.props.type,
      taskCreator: 'Jenny',
      taskModified: Date.now(),
      taskDescription: '',
      isComplete: false,
      assignedTo: [],
      repeatInterval: 'none',
      riWeekly: [],
      riMonthly: [],
      riTaskTime: Date.now(),
      taskDate: Date.now(),
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleRepeatChange = this.handleRepeatChange.bind(this);
  }

  handleNameChange(e) {
    this.setState({ taskName: e.target.value });
  }

  handleDescChange(e) {
    this.setState({ taskDescription: e.target.value });
  }

  handleTypeChange(e) {
    this.setState({ taskType: e.target.value });
  }

  handleDateChange(date) {
    this.setState({ taskDate: date });
  }

  handleRepeatChange(e) {
    let date = new Date();
    let riWeekly = [];
    let riMonthly = [];

    switch(e.target.value) {
      case "none":
        break;
      case "weekly":
        riWeekly = [date.getDay()];
        break;
      case "monthly":
        riMonthly = [date.getDate()];
        break;
      default:
        break;
    }

    this.setState({
      repeatInterval: e.target.value,
      riWeekly: riWeekly,
      riMonthly: riMonthly,
    });
  }

  handleSubmitButtonPress() {
    this.props.handleTaskCreation(Object.assign({}, this.state));
  }

  render() {

    if (!this.props.type) return(null);

    return(
      <div>
        <Card id="tabList">
          <CardContent
            className={this.props.type}
          >
            <Row>
              <Col xs={9}>
                <FormControl
                  type="text"
                  placeholder={"Enter " + this.props.type + " name"}
                  onChange={this.handleNameChange}
                />
              </Col>
              <Col xs={3}>
                <Button bsStyle="success" onClick={() => this.handleSubmitButtonPress()}>Create</Button>
              </Col>
            </Row>
          </CardContent>
          <CardContent>
            <Row>
              <Col xs={6}>
                <ControlLabel>Due Date</ControlLabel>
                <DatePicker className="date-picker"
                  selected={this.state.taskDate}
                  onChange={this.handleDateChange}
                />
              </Col>
              <Col xs={6}>
                <ControlLabel>Repeat</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={this.handleRepeatChange}
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <ControlLabel>{this.props.type} Description</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  rows="5"
                  placeholder={"Give a description of your " + this.props.type}
                  onChange={this.handleDescChange}
                />
              </Col>
            </Row>
          </CardContent>
        </Card>
      </div>
    );
  }
}
