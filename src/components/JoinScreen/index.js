import React, {Component} from 'react';
import {Grid, Row, Button, FormControl} from 'react-bootstrap';



export default class JoinScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupScreen: 0,
      userName: '',
      groupName: 'My Group',
      groupID: null,
      groupCode: '',
      displayError: '',
    };
    this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
    this.handleGroupCodeChange = this.handleGroupCodeChange.bind(this);
  }

  handleScreenState(s) {
    this.setState({
      groupScreen: s
    });
  }

  handleGroupNameChange(e) {
    this.setState({ groupName: e.target.value });
  }

  handleGroupCodeChange(e) {
    this.setState({ groupCode: e.target.value });
  }

  handleCreateNewUser() {
    let newUser = {
      groupID: this.state.groupID,
      name: this.state.userName,
      uid: this.props.user.uid
    };
    let updates = {};
    updates['/users/' + newUser.uid] = newUser;
    console.log(this.props.database);
    this.props.database.ref().update(updates);
    this.props.handleJoinedGroup();
  }

  handleGroupCreation() {
    let ref = this.props.database.ref().child('groups/');
    let newGroupKey = ref.push().key;
    let newGroup = {
      groupAdmin: this.props.user.uid,
      groupID: newGroupKey,
      groupName: this.state.groupName
    };
    let updates = {};
    updates[newGroupKey] = newGroup;
    ref.update(updates);
    this.setState({
      groupID: newGroupKey,
      groupScreen: 3,
    });
  }

  handleGroupJoining() {
    let ref = this.props.database.ref().child('groups/');
    ref.on("value", (data) => {
        let groupID = null;
        data.forEach((child) => {
            let id = child.val().groupID;
            if (id.substr(id.length - 6).toLowerCase() === this.state.groupCode.toLowerCase())
              groupID = child.val().groupID;
        });
        if (groupID) {
          this.setState({
            groupID: groupID,
            groupScreen: 3,
          });
        }
        else {
          // error: could not find group
          this.setState({ displayError: 'Group code not found!' });
        }
    });
  }


  render() {
    var body;

    switch(this.state.groupScreen) {
      case 0:
        body = (
          <Row>
            <Row>
              <p><i>All your household information in one place</i></p>
              <h4>Get Started now:</h4>
            </Row>
            <Row id="Login">
              <Button onClick={() => this.handleScreenState(1)}>Create a Group</Button>
            </Row>
            <Row>
              <h4> or </h4>
              <Button onClick={() => this.handleScreenState(2)}>Join an existing Group</Button>
            </Row>
          </Row>
        );
        break;
      case 1: // creation
        body = (
          <Row>
            <p>Give your group a name!</p>
            <FormControl
              autoFocus
              type="text"
              placeholder={"Enter your group's name"}
              onChange={this.handleGroupNameChange}
            />
            <Button onClick={() => this.handleGroupCreation()}>Create Group</Button>
            <Button onClick={() => this.handleScreenState(0)}>Go Back</Button>
          </Row>
        );
        break;
      case 2: // creation
        body = (
          <Row>
          <p>Enter your <b>6-digit group code</b>:</p>
          <p style={{color: 'red'}}>{this.state.displayError}</p>
          <FormControl
            autoFocus
            type="text"
            placeholder={"Enter group code here"}
            onChange={this.handleGroupCodeChange}
          />
          <Button onClick={() => this.handleGroupJoining()}>Join Group</Button>
          <Button onClick={() => this.handleScreenState(0)}>Go Back</Button>
          </Row>
        );
        break;
      case 3: // displayname
        body = (
          <Row>
            <p>Give yourself a name and you're all set!</p>
            <FormControl
              autoFocus
              type="text"
              value={this.props.user.displayName.split(" ")[0]}
              placeholder={"Enter your display name"}
              onChange={this.handleGroupNameChange}
            />
            <Button onClick={() => this.handleCreateNewUser()}>Submit</Button>
          </Row>
        );
        break;
      default:
        body = "";
        break;
    };

    return(
      <Grid id="Login">
          <Row className="align-middle">
            <h2>Welcome to Homie!</h2>
          </Row>
          {body}
      </Grid>
    );

  }

}
