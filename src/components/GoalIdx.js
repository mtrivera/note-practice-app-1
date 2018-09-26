import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import MenuBar from './MenuBar'
import SetGoal from './SetGoal'
import PickGoal from './PickGoal'
// import DisplayGoal from './DisplayGoal'
import Quiz from './Quiz'
import DisplayPitches from './DisplayPitches'
import GoalProgress from './GoalProgress'

class GoalIdx extends Component {
  // Props: 
  //  goals, 
  // firstname, 
  // saveQuizResults - function()

  state = {
    currentGoalIdx: 0,
    started: false,
    paused: false,
    finished: false,
    resultSpeeds: null
  }

  selectGoal = (idx) => {
    // const goals = this.props.goals.slice()
    // for (let goal of goals) {
    //   goal.current = false
    // }
    // goals[idx].current = true
    this.setState({ /*goals,*/ currentGoalIdx: idx })
  }

  startQuiz = e => {
    this.setState({ started: true })
  }

  stopQuiz = (results) => {
    const goalId = this.props.goals[this.state.currentGoalIdx].goalId
    // console.log('goalId is ', goalId)
    this.props.saveQuizResults(goalId, results)
    this.setState({ started: false, paused: true, resultSpeeds: results.pitches })
  }

  startOver = e => {
    this.setState({ paused: false, finished: false })
  }

  render() {
    const currentGoal = this.props.goals[this.state.currentGoalIdx]
    console.log('Current goal', currentGoal)

    if (this.state.started) {
      return (
        <Quiz
          pitchIds={currentGoal.pitchIds}
          title={currentGoal.title}
          targetProgress={currentGoal.targetProgress}
          stopQuiz={this.stopQuiz}
        />
      )
    }

    return (
      <div>
          <h1>{this.props.firstname}'s Goals</h1>
          <PickGoal 
            goals={this.props.goals} 
            selectGoal={this.selectGoal} 
            currentGoalIdx={this.state.currentGoalIdx}
            userId={this.props.match.params.userId}
          />
          <p>Target: { Number(currentGoal.targetProgress)/1000 } seconds per note</p>
          <DisplayPitches noteIds={currentGoal.pitchIds}/>
          <GoalProgress goal={currentGoal}/>
          <button className="go" onClick={this.startQuiz}>Start</button>
          <Link to={'/user/' + this.props.match.params.userId + '/goal/new'}>Set a new goal</Link>
          <p>
            <a href="#" onClick={() => this.props.destroyGoal(currentGoal.goalId)}>
              Permanently delete this goal (<em>{currentGoal.title}</em>)
            </a>
          </p>
      </div>
    )
  }
}

export default GoalIdx
