import React from 'react';
// import ApiCalendar from 'react-google-calendar-api'; //https://www.npmjs.com/package/react-google-calendar-api
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CalendarAddEvent from './CalendarAddEvent';


import './index.scss';

import moment from 'moment'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

export default class Calendar extends React.Component {
    constructor(props) {
      super(props);
 
      this.state = {
        tasks : {}
        ,
        events : []
      };

      this.tasksToEvents = this.tasksToEvents.bind(this);
      this.handleSelectEvent = this.handleSelectEvent.bind(this);
      this.eventStyleGetter = this.eventStyleGetter.bind(this);
      }

    componentDidMount(){
      console.log("the calendar has mounted")
      let taskListRef = this.props.database.ref('taskList');
      taskListRef.on('value', snapshot => {
        this.setState({
          tasks: snapshot.val(), 
       }, () => {this.tasksToEvents()});
      });

    }

    tasksToEvents(){
      let calEvents = Object.keys(this.state.tasks).map((key)=> {
        console.log(key);
        return {
          "start" : new Date(parseInt(this.state.tasks[key].taskDate)),
          "end" : new Date(parseInt(this.state.tasks[key].taskDate) + 3600*1000),
          "title" : this.state.tasks[key].taskName,
          "assignedTo" : this.state.tasks[key].assignedTo != null ? this.state.tasks[key].assignedTo : "nobody" 
        };
      });

      console.log(calEvents);

      this.setState({events : calEvents}, console.log("events" , this.state.events));
    }


    handleSelect(slots) {
        const title = window.prompt('New Event name')
        if (title){
          let newEvent = {
            "start": slots.start,
            "end" : slots.end,
            title,
            "isSelected" : false
          };
          this.setState({
            events: [
              ...this.state.events,
              , newEvent
            ],
          });

          this.handleEventAdd(newEvent);

        }
          

          // also need to add the one changed thing to the DB

    }

    handleSelectEvent(event, e){
      //console.log("selected event", event, e);

    }
      
    eventStyleGetter(event) {
      console.log("style getter");

      console.log("event", event);
      //console.log("start", start);
      //console.log("end", end);
      //console.log("isSelected", isSelected);

      

      let backgroundColor = event.assignedTo.includes("Matt") ? "#5FB49C" : "#682D63";
      let newStyle = {
          style : {backgroundColor}
      };
      return newStyle;
  }
  

  
    handleEventAdd(event) {
      console.log(event);

      let eventKey = this.props.database.ref().child('taskList').push().key;
      let submittedTask = {
        assignedTo: ["NOBODY"],
        isDeleted: 0,
        isComplete: true,
        paymentTotal: 0,
        repeatInterval: "None",
        riMonthly: " ",
        riWeekly: " ",
        taskCreator: " ", // should be the user somehow
        taskDate: event.start.getTime(),
        taskDescription: event.title,
        taskID: eventKey,
        taskModified:  Date.now(),
        taskName: event.title,
        taskType: "Chore",
      };
    let updates = {};
    updates['/taskList/' + eventKey] = submittedTask;
    this.props.database.ref().update(updates);

  }

    render() {

      return ( 
      <div className="cal-container">
        <BigCalendar
          selectable
          localizer={localizer}          
          eventPropGetter={(e) => this.eventStyleGetter(e)}

          events = {this.state.events}
          views={['week']} // make a custom view for three days to use for mobile
          showMultiDayTimes
          defaultDate={new Date()}
          defaultView={"week"}
          onSelectSlot={(slots) => {this.handleSelect(slots)}}
          popup = {true}
          popupOffset={30}
          longPressThreshold={100}
          onSelectEvent= {(event, e) => this.handleSelectEvent(event, e)}

        />
      </div>
    );
    }
}