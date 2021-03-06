import React, { Component } from 'react';
import PickNotes from './PickNotes'


class SetGoal extends Component {
  state = {
    title: '',
    targetProgress: 4500,
    validationMessage: '',
    pitchesSelected: '',
    numPitchesSelected: 0,
  }

  setTitle = e => {
    this.setState({ title: e.target.value })
  }

  setSeconds = e => {
    this.setState({ targetProgress: Number(e.target.value) * 1000 })
  }

  updatePitchesSelected = pitches => {
    this.setState({ pitchesSelected: pitches, numPitchesSelected: pitches.length })
  }

  submit = e => {
    e.preventDefault()
    const goal = {
      title: this.state.title,
      targetProgress: this.state.targetProgress,
      pitchIds: this.state.pitchesSelected
    }

    if (goal.pitchIds.length < 4) {
      this.setState({ validationMessage: 'You must select 4 pitches or more.'})
    } else {
      this.setState({ validationMessage: null })
      this.props.saveGoal(goal)
      this.props.history.push(`/user/${this.props.match.params.userId}`)
    }
  }

  render() {
    return (
      <div>
          <h1>Set a goal</h1>
          <form onSubmit={this.submit}>
            <fieldset>
              <p className="step">1. Enter a title for your goal.</p>
              <p>Examples: "Treble lines", "Violin D string"</p>
              <input type="text" placeholder="Title" onBlur={this.setTitle} minLength="4" maxLength="38" pattern="[a-zA-Z0-9]+.*" required/>
            </fieldset>
            <fieldset>
              <p className="step">2. Enter a number of seconds for each note.</p>
              <p>We suggest 1-5 seconds.</p>
              <label><input type="number" name="targetProgress" defaultValue="3.5" onBlur={this.setSeconds} step=".1" min="0.5" required/> seconds</label>
            </fieldset>
            <fieldset>
              <p className="step">3. Select a set of notes for this goal.</p>
              <PickNotes updatePitchesSelected={this.updatePitchesSelected}/>
              <p>You have selected {this.state.numPitchesSelected} notes.</p>
              {this.state.validationMessage && <p className="warning">{this.state.validationMessage}</p>}
            </fieldset>
            <button type="submit" className="go">Save</button>
          </form>
      </div>
    )
  }
}

export default SetGoal
