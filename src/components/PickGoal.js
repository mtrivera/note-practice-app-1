import React from 'react'
import '../css/pickgoal.css'

class PickGoal extends React.Component {

  // classForGoal(title) {
  //   console.log(this.props.currentGoal, title)
  //   if (this.props.currentGoal.title === title) {
  //     return 'selected';
  //   } else {
  //     return '';
  //   }
  // }

  render() {
    return (
      <ul id="goal-list">
        {this.props.goals.map( (goal, idx) => {
          return (
            <li
              key={idx}
              className={goal.current ? 'current' : ''}
              onClick={() => this.props.selectGoal(idx)}
            >
              {goal.title}
            </li>
          )
        })}
      </ul>
    )
  }
}


export default PickGoal
