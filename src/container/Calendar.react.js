/**
* Calendar container component.
* @flow
*/

console.ignoredYellowBox = ['Warning: Overriding '];

import React, { Component, PropTypes } from 'react';
import {
  LayoutAnimation,
  Slider,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

// Component specific libraries.
import _ from 'lodash';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome'

//icons
const leftArrow = (<Icon name="angle-left" size={30} color="white"/>)
const rightArrow = (<Icon name="angle-right" size={30} color="white"/>)

// Pure components importing.
import YearSelector from '../pure/YearSelector.react';
import MonthSelector from '../pure/MonthSelector.react';
import DaySelector from '../pure/DaySelector';

type Stage = "day" | "month" | "year";
const DAY_SELECTOR : Stage = "day";
const MONTH_SELECTOR : Stage = "month";
const YEAR_SELECTOR : Stage = "year";


type Props = {
  // The core properties.
  annualEvents: array,
  selected?: Moment,
  onDayChange?: (date: Moment) => void,
  onMonthChange?: (date) => void,
  slideThreshold?: number,
  dayPainted?: array,
  groupedByMonths: array,
  // Minimum and maximum date.
  minDate: Moment,
  maxDate: Moment,
  // The starting stage for selection. Defaults to day.
  startStage: Stage,
  // General styling properties.
  style?: View.propTypes.style,
  barView?: View.propTypes.style,
  barText?: Text.propTypes.style,
  stageView?: View.propTypes.style,
  showArrows: boolean,
  // Styling properties for selecting the day.
  dayHeaderView?: View.propTypes.style,
  dayHeaderText?: Text.propTypes.style,
  dayRowView?: View.propTypes.style,
  dayView?: View.propTypes.style,
  daySelectedView?: View.propTypes.style,
  dayText?: Text.propTypes.style,
  dayTodayText?: Text.propTypes.style,
  daySelectedText?: Text.propTypes.style,
  dayDisabledText?: Text.propTypes.style,
  // Styling properties for selecting the month.
  monthText?: Text.propTypes.style,
  monthDisabledText?: Text.propTypes.style,
  // Styling properties for selecting the year.
  yearMinTintColor?: string,
  yearMaxTintColor?: string,
  yearSlider?: Slider.propTypes.style,
  yearText?: Text.propTypes.style,
};
type State = {
  stage: Stage,
  // Focus points to the first day of the month that is in current focus.
  focus: Moment,
};

export default class Calendar extends Component {
  static defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      stage: props.startStage,
      focus: Moment(props.selected).startOf('month'),
      monthOffset: 0,
      daysWithEvent: props.annualEvents,
      date: Moment(),
      groupEventsByMonths: [],
      currentMonthEvents: [],
      currentMonth: Moment(),
    }
  }

  _changeFocus = (focus) => {
    //TODO: trigger event data
    this.setState({focus, monthOffset: 0});
    this._nextStage();
  }

  _stageText = () => {
    if (this.state.stage === DAY_SELECTOR) {
      return this.state.focus.format('MMMM YYYY');
    } else {
      return this.state.focus.format('YYYY');
    }
  }

  _previousStage = () => {
    if (this.state.stage === DAY_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: YEAR_SELECTOR})
    }
    LayoutAnimation.easeInEaseOut();
  }

  _nextStage = () => {
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: DAY_SELECTOR})
    }
    if (this.state.stage === YEAR_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
    LayoutAnimation.easeInEaseOut();
  }

  _currentMonthEvents(date) {
    this.setState({currentMonth: date})

    let currentMonthEvents = this._getInitialMonthEv(this.state.currentMonth, this.state.groupEventsByMonths)

    if (currentMonthEvents !== undefined) {

      console.log(currentMonthEvents);
      this.setState({currentMonthEvents: currentMonthEvents})

      // Get days events
      let daysWithEvent = this._getDayWithEvents(currentMonthEvents)

      this.props.onMonthChange(date, currentMonthEvents, daysWithEvent)
      this.setState({daysWithEvent: daysWithEvent})
    } else {
      // this.props.onDayChange(date)
      this.props.onMonthChange(date)
      this.setState({daysWithEvent: []})
      this.setState({currentMonthEvents: []})
    }
  }

  _previousMonth = () => {
    let date = this.state.currentMonth.subtract(1, 'month')

    this._currentMonthEvents(date)
    
    this.setState({monthOffset: -1});
  }

  _nextMonth = () => {
    let date = this.state.currentMonth.add(1, 'month')

    this._currentMonthEvents(date)
    
    this.setState({monthOffset: 1})
  }

  _getDayWithEvents(currentMonthEvents) {
    let daysWithEvent

    let days = currentMonthEvents.map((res) => {
      return parseInt(Moment(res.date, 'YYYY-MM-DD').format('D'))
    })

    return daysWithEvent = days.filter((elem, index, self) => {
      return index == self.indexOf(elem)
    })
  }

  _getInitialMonthEv(date, groupEventsByMonths) {
    console.log(date);
    console.log(groupEventsByMonths);
    console.log(date.format('YYYY-MM'));
    let currentMonthEvents

    for (var key in groupEventsByMonths) {
        console.log(key);
      if (date.format('YYYY-MM') == key) {
        return currentMonthEvents = groupEventsByMonths[key]
      }
    }
  }

  _getEvByMonths() {
    let groupEventsByMonths

    return groupEventsByMonths = _.groupBy(this.props.annualEvents, (res) => {
      return res.date.substring(0, 7)
    })
  }

  _getDayEvents(date) {
    let dayEvents = []
    let formatedDay = Moment(date).format('YYYY-MM-DD')
    console.log(date);
    console.log(this.state.currentMonthEvents);
    this.state.currentMonthEvents.map((event) => {
      if (event.date === formatedDay) {
        dayEvents.push(event)
      }
    })

    return dayEvents
  }
  _onDayChange(date) {
    let formatedDay = Moment(date).format('YYYY-MM-DD')

    // Get day events
    let dayEvents = this._getDayEvents(date)

    this.props.onDayChange(date, dayEvents)
    this.setState({date: date})
  }

  componentDidMount() {
    let currentMonthEvents
    let groupEventsByMonths
    console.log(this.props.annualEvents);
    if (this.props.annualEvents.length != 0) {
      // Get event group by months
      groupEventsByMonths = this._getEvByMonths()
      this.setState({groupEventsByMonths: groupEventsByMonths})
      console.log(groupEventsByMonths);
      console.log(this.state.currentMonth);
      //Get initial month events
      currentMonthEvents = this._getInitialMonthEv(this.state.currentMonth, groupEventsByMonths)
      console.log(currentMonthEvents);
      this.setState({currentMonthEvents: currentMonthEvents})
      // Get days with events
      let daysWithEvent = this._getDayWithEvents(currentMonthEvents)
      this.setState({daysWithEvent: daysWithEvent})
    }
  }

  render() {
    const barStyle = StyleSheet.flatten([styles.barView, this.props.barView]);

    const previousMonth = Moment(this.state.focus).subtract(1, 'month');
    const previousMonthValid = this.props.minDate.diff(Moment(previousMonth).endOf('month'), 'seconds') <= 0;
    const nextMonth = Moment(this.state.focus).add(1, 'month');
    const nextMonthValid = this.props.maxDate.diff(Moment(nextMonth).startOf('month'), 'seconds') >= 0;

    return (
      <View style={[{
        minWidth: 300,
        // Wrapper view default style.
      },this.props.style]}>
        <View style={{
          flexDirection: 'row',
        }}>
          <View style={[styles.barView, this.props.barView]}>
            { this.props.showArrows && this.state.stage === DAY_SELECTOR && previousMonthValid ?
              <TouchableHighlight
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
                onPress={this._previousMonth}
              >
                <Text style={[this.props.barText, {marginRight:20}]}>{leftArrow}</Text>
              </TouchableHighlight> : <View/>
            }

            <TouchableHighlight
              activeOpacity={this.state.stage !== YEAR_SELECTOR ? 0.8 : 1}
              underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
              onPress={this._previousStage}
              style={{ alignSelf: 'center' }}
            >
              <Text style={this.props.barText}>
                {this._stageText()}
              </Text>
            </TouchableHighlight>

            { this.props.showArrows && this.state.stage === DAY_SELECTOR && nextMonthValid ?
              <TouchableHighlight
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
                onPress={this._nextMonth}
              >
                <Text style={[this.props.barText, {marginLeft:20}]}>{rightArrow}</Text>
              </TouchableHighlight> : <View/>
            }
          </View>
        </View>
        <View
          style={[styles.stageWrapper, this.props.stageView]}>
          {
            this.state.stage === DAY_SELECTOR ?
            <DaySelector
              ref='dayselector'
              focus={this.state.focus}
              selected={this.state.date}
              onFocus={this._changeFocus}
              onDayChange={(date) => this._onDayChange(date)}
              monthOffset={this.state.monthOffset}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              // Control properties
              slideThreshold={this.props.slideThreshold}
              // Transfer the corresponding styling properties.
              dayHeaderView={this.props.dayHeaderView}
              dayHeaderText={this.props.dayHeaderText}
              dayRowView={this.props.dayRowView}
              dayView={this.props.dayView}
              daySelectedView={this.props.daySelectedView}
              dayText={this.props.dayText}
              dayTodayText={this.props.dayTodayText}
              daySelectedText={this.props.daySelectedText}
              dayDisabledText={this.props.dayDisabledText}
              dayPainted={this.props.dayPainted}
              /> :
            this.state.stage === MONTH_SELECTOR ?
            <MonthSelector
              focus={this.state.focus}
              onFocus={this._changeFocus}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              // Styling properties
              monthText={this.props.monthText}
              monthDisabledText={this.props.monthDisabledText}
              /> :
            this.state.stage === YEAR_SELECTOR ?
            <YearSelector
              focus={this.state.focus}
              onFocus={this._changeFocus}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              // Styling properties
              minimumTrackTintColor={this.props.yearMinTintColor}
              maximumTrackTintColor={this.props.yearMaxTintColor}
              yearSlider={this.props.yearSlider}
              yearText={this.props.yearText}
              /> :
            null
          }
        </View>
      </View>
    )
  }
}
Calendar.defaultProps = {
  minDate: Moment(),
  maxDate: Moment().add(10, 'years'),
  startStage: DAY_SELECTOR,
  showArrows: false,
}

// Calendar.propTypes = {
//   // The core properties.
//   annualEvents: PropTypes.array,
//   selected: PropTypes.date,
//   onDayChange: PropTypes.date,
//   onMonthChange: PropTypes.date,
//   slideThreshold: PropTypes.number,
//   dayPainted: PropTypes.array,
//   groupedByMonths: PropTypes.array,
//   // Minimum and maximum date.
//   minDate: PropTypes.date,
//   maxDate: PropTypes.date,
//   // The starting stage for selection. Defaults to day.
//   startStage: PropTypes.oneOf(['day', 'month', 'year']),
//   // General styling properties.
//   style: PropTypes.any,
//   barView: PropTypes.any,
//   barText: PropTypes.any,
//   stageView: PropTypes.any,
//   showArrows: boolean,
//   // Styling properties for selecting the day.
//   dayHeaderView: PropTypes.any,
//   dayHeaderText: PropTypes.any,
//   dayRowView: PropTypes.any,
//   dayView: PropTypes.any,
//   daySelectedView: PropTypes.any,
//   dayText: PropTypes.any,
//   dayTodayText: PropTypes.any,
//   daySelectedText: PropTypes.any,
//   dayDisabledText: PropTypes.any,
//   // Styling properties for selecting the month.
//   monthText: PropTypes.any,
//   monthDisabledText: PropTypes.any,
//   // Styling properties for selecting the year.
//   yearMinTintColor: PropTypes.string,
//   yearMaxTintColor: PropTypes.string,
//   yearSlider: Slider.propTypes.style,
//   yearText: PropTypes.any,
// }; 


const styles = StyleSheet.create({
  barView: {
    flexGrow: 1,
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextStage: {
    padding: 5,
    alignItems: 'center',
  },
  stageWrapper: {
    padding: 5,
    overflow: 'hidden',
  },
});
