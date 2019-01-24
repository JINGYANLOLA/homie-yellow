import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import TaskItem from './TaskItem';
import TaskCreationForm from './TaskCreationForm';
import './index.scss';

export default class TaskTabs extends Component {

    render() {
      let ref = this.props.database.ref('taskList/');
      let activeTab = this.props.activeTab;
      let tabNames = ["Active", "Assigned to Me", "Completed"];
      let currUser = 'Jenny';
      let data_list = [];

      switch(activeTab) {
        case 0: // active
          ref.orderByChild("isComplete").equalTo(false).on("value", (data) => {
            data.forEach((child) => {
              if (!child.val().isDeleted)
                data_list.push(child.val());
            });
          });
          break;
        case 1: // assigned to me
          ref.orderByChild("assignedTo").on("value", (data)  =>{
            data.forEach((child) => {
              let assignedTo = child.val().assignedTo;
              if (assignedTo != null && assignedTo.includes(currUser))
                data_list.push(child.val());
            });
          });
          break;
        case 2: // completed
          ref.orderByChild("isComplete").equalTo(true).on("value", (data) => {
            data.forEach((child) => {
              data_list.push(child.val());
            })
          });
          break;
        default:
          data_list = [];
          break;
      }

      let task_items = data_list.map((task) => {
        return(
            <TaskItem
              key={task.taskModified}
              task={task}
              handleTaskCompleted={() => this.props.handleTaskCompleted(task)}
              handleDeleteTask={(t) => this.props.handleDeleteTask(t)}
              personsInGroup={this.props.personsInGroup}
              handleTaskSubmission={(t) => this.props.handleTaskSubmission(t)}
            />
        );
      });

      if (!task_items.length)
        task_items = <p>There are no tasks currently.</p>;

      let tabs = tabNames.map((name, i) => {
        return(
          <Tab title={name} key={name} eventKey={i}>
            {task_items}
          </Tab>
        );
      });

      let taskCreationForm = (this.props.taskCreation) ? (
        <TaskCreationForm
          taskID={null}
          task={null}
          personsInGroup={this.props.personsInGroup}
          type={this.props.taskCreation}
          database={this.props.database}
          handleTaskSubmission={(task) => this.props.handleTaskSubmission(task)}
        />
      ) : <div></div>;

      return(
        <div id="tabList">
          <Tabs
            id="Task Tabs"
            activeKey={activeTab}
            onSelect={(t) => this.props.handleTabPress(t)}
            animation={false}
          >
              {taskCreationForm}
              {tabs}
          </Tabs>
        </div>
      );
    }
}
