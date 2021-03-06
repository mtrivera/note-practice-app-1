import React, { Component } from 'react';
import Staff from './Staff'
import { trebleNotesObj, bassNotesObj, altoNotesObj } from '../music'

class PickNotes extends Component {
  state = {
    noteStatus: {
      treble: trebleNotesObj,
      bass: bassNotesObj,
      alto: altoNotesObj,
    },
    showStaff: {
      treble: true,
      bass: true,
      alto: false,
    },
    showLedger: false,
  }

  toggleStaff(staff, value) {
    const showStaff = { ...this.state.showStaff }
    showStaff[staff] = value
    this.setState({ showStaff }, this.update)
  }

  selectPitch = (pitch, staff) => {
    const noteStatus = { ...this.state.noteStatus }
    if (noteStatus[staff][pitch] !== 'selected') {
      noteStatus[staff][pitch] = 'selected'
    } else {
      noteStatus[staff][pitch] = ''
    }
    this.setState({ noteStatus }, this.update)
  }

  update() {
    this.props.updatePitchesSelected(this.getVisibleSelection())
  }

  getVisibleSelection() {
    //Returns array of noteId's from visible staff(s) where this.state.noteStatus[staff].noteId === 'selected.'
    let selection = []
    const staves = ['treble', 'bass', 'alto']
    staves.forEach(function(staff) {
      if (this.state.showStaff[staff]) {
        selection = selection.concat(this.selectedPitches(this.state.noteStatus[staff]))
      }
    }, this)
    return selection
  }

  selectedPitches(noteObj) { // returns an array of pitch names for one staff.
    return Object.keys(noteObj).filter( id => noteObj[id] === 'selected')
  }

  render() {
    return (
      <div>
        <fieldset id="options">
          {/*<label>            // Feature to add later
            <input
              type="checkbox"
              name="ledger"
              onChange={this.toggleLedger}
            />
            Ledger Lines
          </label>*/}
          <label>
            <input
              type="checkbox"
              onChange={e => this.toggleStaff('treble', e.target.checked)}
              defaultChecked
            />
            Treble clef
          </label>
          <label>
            <input
              type="checkbox"
              onChange={e => this.toggleStaff('bass', e.target.checked)}
              defaultChecked
            />
            Bass clef
          </label>
          {/*<label>      // Feature to add later
            <input
              type="checkbox"
              onChange={e => this.toggleStaff('alto', e.target.checked)}
            />
            Alto clef
          </label>*/}
        </fieldset>
        <fieldset>
          {this.state.showStaff.treble &&
            <Staff
              pitchesObj={this.state.noteStatus.treble}
              staff="treble"
              selectPitch={this.selectPitch}
              top="3"
              height="18"
              size="12"
            />
          }
          {this.state.showStaff.bass &&
            <Staff
              pitchesObj={this.state.noteStatus.bass}
              staff="bass"
              selectPitch={this.selectPitch}
              top="3"
              height="16"
              size="12"
            />
          }
        </fieldset>
      </div>
    )
  }
}

export default PickNotes
