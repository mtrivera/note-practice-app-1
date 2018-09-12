import token from './token'

const baseUrl = "http://musical-app.herokuapp.com"

export async function getUser(userId) {
  const url = `${baseUrl}/${userId}`
  const myHeaders = new Headers()
  myHeaders.append('token', token)

  const user = await fetch(url, { method: 'GET', headers: myHeaders })
  .then(res => res.json())
  .then(res => {
    console.log('Success: ', res)
    return res
  }, err => console.log(err))
  return user
}

export function getGoals(user) {
  const goals = user.goals.map( goal => {
    return {
      title: goal.title,
      targetProgress: goal.targetProgress,
      goalId: goal._id,
      pitches: goal.pitches.map( pitch => pitch.pitchid )
    }
  }).reverse()
  return goals
}

export function saveQuizResults(quizResults, userId, goalId) {
  console.log('saving quiz results . . .')
  const url = `${baseUrl}/${userId}/${goalId}/speedup`

  const myHeaders = new Headers()
  myHeaders.append('token', token)
  myHeaders.append('Content-Type', 'application/json')

  const body = JSON.stringify(quizResults)
  console.log('request body: ', body)

  fetch(url, { method: 'PUT', headers: myHeaders, body: body })
  .then(result => result.json())
  .then(result => {
      console.log('Saved quiz results!')
      console.log(result)
    }
  ).catch(err => console.log(err))
}

export function saveGoal(goal, userId) {
  const url = `${baseUrl}/${userId}/newgoal`
  const myHeaders = new Headers()
  myHeaders.append('token', token)
  myHeaders.append('Content-Type', 'application/json')
  const body = JSON.stringify(goal)

  fetch(url, { method: 'POST', headers: myHeaders, body: body })
  .then(result => result.json())
  .then(result => {
      console.log('Saved goal!')
      console.log(result)
    }
  ).catch(err => console.log(err))
}

export async function destroyGoal(userId, goalId) {
  const oldUser = await getUser(userId)
  console.log('goalIds for user: ', oldUser.goals.map(goal => goal._id))

  console.log('Deleting goalId: ' + goalId)
  const url = `${baseUrl}/${userId}/${goalId}/deletegoal`
  const myHeaders = new Headers()
  myHeaders.append('token', token)

  const user = await fetch(url, {method: 'DELETE', headers: myHeaders})
  .then(result => result.json())
  .then(result => {
    console.log('Successfully deleted goal.')
    console.log('Remaining goalIDs: ', result.goals.map(goal => goal._id))
    return result
  })
  .catch(err => console.log(err))
  return user
}

export async function getRawPitchData(userId) {
  const url = `${baseUrl}/${userId}/pitches`
  const myHeaders = new Headers()
  myHeaders.append('token', token)

  const rawPitchData = await fetch(url, {method: 'GET', headers: myHeaders})
  .then(result => result.json())
  .then (result => {
    console.log(result)
    return result
  })
  .catch(err => console.log(err))
  return rawPitchData
}

async function goalsDataStructure(userId) {
  const rawGoals = await getUser(userId).goals
  const result = {}
  rawGoals.forEach( goal => {
    result[goal._id] = { title: goal.title, practices: {} }
  })
  return result
}
// returns { "5b8d5ebc157ada00042897db": {title: "Treble lines", practices: {} }, "5b8d5ebc157ada00042881wx": {title: "Low notes", noteSpeeds: []} }

export async function goalsResults(userId) {
  const rawData = await getRawPitchData(userId)
  let results = await goalsDataStructure(userId)
  rawData.forEach( pitch => {
    if (pitch.speeds.length > 0) {
      pitch.speeds.forEach( speed => {
        if (!results[pitch.goalid].practices[speed.date]){
          results[pitch.goalid].practices[speed.date] = []
        }
        results[pitch.goalid].practices[speed.date].push(speed.speed)
      })
    }
  })
  console.log('goalsResults ', results)

  return results
}

function averageAndConvertToSeconds(speedAr) {
  // const average = speedAr.reduce(())
}


/* getRawPitchData returns a resolved promise which is an array of pitch objects with the following shape:
{
  averageSpeed:[{avr:1184, date:"1970-01-01T00:00:00.000Z"], // Not useful.
  goalid:"5b8d5ebc157ada00042897db",                  // Use to obtain speeds per goal.
  pitchid:"e4t-1",
  speeds:[
    {date: "2018-09-04T14:20:05.574Z", speed: 1373},  // If the pitch has not been practiced this array is empty.
    {date: "2018-09-10T19:38:55.635Z", speed: 1478}
  ],
  userid:"5b6fc62b50cad50004ddf233"
  __v:3
  _id:"5b8d5ebc157ada00042897dc"
}

Needed data structures:
Loop through the rawData array once and build the following:

1. goalsResults.
{
  "5b8d5ebc157ada00042897db": { title: "Treble lines", practices: [{"2018-09-04T14:20:05.574Z": [1373, 1549, 994]}, [Date1: []]},
  "5b8d6e5e157ada00042897e9": { title: "All notes",    practices: [{"9/4/2018": 3.4}, {"9/4/2018": 2.7}]

}
- Don't need an id each pitch.
- Use array for speeds to keep dates in order.

- After going through the raw data:
  - Convert each array of speeds into average seconds.
  - Get the title for each goal.

2. pitchesData. A map of pitchIds.dates.pitchSpeeds
{
  "e4t-1": [
    {"2018-09-04T14:20:05.574Z": 1.4}
    {"2018-09-10T19:38:55.635Z": 1.5}
  ],
  "f4t00": [
    {"2018-09-04T14:20:05.574Z": 2.0}
    {"2018-09-10T19:38:55.635Z": 1.9}
  ]

  },
 - Don't need goal info.
 - Use array to keep dates in order.
 - Convert to seconds as I go.

}
*/

