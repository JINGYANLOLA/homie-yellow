import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import TaskItem from './TaskItem';
import TaskCreationForm from './TaskCreationForm';
import './index.scss';

export default class TaskTabs extends Component {

    render() {
      let ref = this.props.database.ref('taskList/');
      let activeTab = this.props.activeTab;
      let tabNames = ["Active", "My Active", "Complete"];
      let currUser = 'Jenny';
      let group_tasks = [];
      let render_tasks = [];

      ref.orderByChild("groupID").equalTo(0).on("value", (data) => {
        data.forEach((child) => {
            group_tasks.push(child.val());
        });
      });

      switch(activeTab) {
        case 0: // active
          render_tasks = group_tasks.filter(task => !task.isComplete);
          break;
        case 1: // assigned to me
          render_tasks = group_tasks.filter(task => {
            if (!task.assignedTo) return false;
            return task.assignedTo.indexOf(currUser) > -1 && !task.isComplete;
          });
          break;
        case 2: // completed
          render_tasks = group_tasks.filter(task => task.isComplete);
          break;
        default:
          break;
      }

      let task_items = render_tasks.map((task) => {
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
          <Tab title={name} key={name} eventKey={i} className="a-tab">
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
            id="TaskTabs"
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
